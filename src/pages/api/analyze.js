import vision from "@google-cloud/vision";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { image } = req.body;

      if (!image) {
        throw new Error("No image provided");
      }

      // Create a client
      const client = new vision.ImageAnnotatorClient();

      // Perform label detection
      const [result] = await client.labelDetection({
        image: { content: image },
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("Error with Vision API:", error.message);
      res.status(500).json({
        error: "Error analyzing the image",
        details: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
