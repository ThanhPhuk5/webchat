import cloudinary from "../libs/cloudinary.js";

// Upload ảnh
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file được upload" });
    }

    // Upload file tạm thời từ multer lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "chat_app/images", // đặt folder gọn gàng trên Cloudinary
    });

    return res.status(200).json({
      message: "✅ Upload ảnh thành công",
      url: result.secure_url, // <--- URL đầy đủ để frontend dùng luôn
      public_id: result.public_id, // <--- để xóa/update sau này (nếu cần)
    });
  } catch (error) {
    console.error("❌ Lỗi upload ảnh:", error);
    res.status(500).json({ message: "Lỗi upload ảnh" });
  }
};

// Upload audio
export const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file được upload" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "chat_app/audio",
      resource_type: "video", // Cloudinary dùng "video" cho audio
    });

    return res.status(200).json({
      message: "✅ Upload audio thành công",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("❌ Lỗi upload audio:", error);
    res.status(500).json({ message: "Lỗi upload audio" });
  }
};
