import { createClient } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, image_url, history } = body;

    let { chatId } = body;

    // 1. Create a new chat if no chatId provided
    if (!chatId) {
      // Generate smart title using Gemini
      const titleClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
      let title = message.slice(0, 30) + (message.length > 30 ? "..." : ""); // Fallback

      try {
        const titleResult = await titleClient.models.generateContent({
          model: "gemini-2.0-flash-exp",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Kullanıcının aşağıdaki mesajı için çok kısa (maksimum 4 kelime) ve anlamlı bir sohbet başlığı oluştur. Sadece başlığı yaz, başka hiçbir şey yazma. Türkçe yaz.

Mesaj: "${message}"

Başlık:`,
                },
              ],
            },
          ],
        });

        const generatedTitle = titleResult.text?.trim();
        if (
          generatedTitle &&
          generatedTitle.length > 0 &&
          generatedTitle.length <= 50
        ) {
          title = generatedTitle;
        }
      } catch (e) {
        console.error("Failed to generate title:", e);
        // Use fallback title
      }

      const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .insert({ user_id: user.id, title })
        .select()
        .single();

      if (chatError) throw chatError;
      chatId = chatData.id;
    }

    // 2. Save User Message
    const { error: msgError } = await supabase.from("messages").insert({
      chat_id: chatId,
      role: "user",
      content: message,
      image_url: image_url || null,
    });

    if (msgError) throw msgError;

    // 3. Prepare Gemini Request
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // History construction for new SDK
    const contents = history
      ? history.map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }))
      : [];

    // Current message
    const currentParts: any[] = [{ text: message }];

    if (image_url) {
      try {
        const imageResp = await fetch(image_url);
        const imageBuffer = await imageResp.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString("base64");

        currentParts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        });
      } catch (e) {
        console.error("Failed to fetch image for Gemini:", e);
      }
    }

    // Add current turn (User)
    contents.push({
      role: "user",
      parts: currentParts,
    });

    // 4. Generate Content
    // Using gemini-2.0-flash-exp as verified by debug script
    const result = await client.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: contents,
    });

    // Extract text safely
    const responseText = result.text;

    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    // 5. Save Assistant Message
    const { error: assistantMsgError } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        role: "assistant",
        content: responseText,
      });

    if (assistantMsgError) throw assistantMsgError;

    return NextResponse.json({
      chatId,
      content: responseText,
    });
  } catch (error: any) {
    console.error("Chat API Error Detailed:", {
      message: error.message,
      stack: error.stack,
      details: error,
    });
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
