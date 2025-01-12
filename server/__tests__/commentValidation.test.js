const mongoose = require("mongoose");

const Comment = require("../../server/models/Comment"); // Adjust path





describe("Comment Schema Unit Tests", () => {
  it("should create a comment with valid fields", async () => {
    const comment = new Comment({
      user: new mongoose.Types.ObjectId(),
      productId: new mongoose.Types.ObjectId(),
      content: "Great product!",
    });
    const savedComment = await comment.save();

    expect(savedComment._id).toBeDefined();
    expect(savedComment.content).toBe("Great product!");
    expect(savedComment.isApproved).toBe("pending");
  });

  it("should throw a validation error if 'user' field is missing", async () => {
    const comment = new Comment({
      productId: new mongoose.Types.ObjectId(),
      content: "Missing user field",
    });

    await expect(comment.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should throw a validation error if 'productId' field is missing", async () => {
    const comment = new Comment({
      user: new mongoose.Types.ObjectId(),
      content: "Missing productId field",
    });

    await expect(comment.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("should default 'timestamp' to the current date", async () => {
    const comment = new Comment({
      user: new mongoose.Types.ObjectId(),
      productId: new mongoose.Types.ObjectId(),
      content: "Checking timestamp",
    });
    const savedComment = await comment.save();

    const now = new Date();
    const timeDifference = Math.abs(savedComment.timestamp.getTime() - now.getTime());

    expect(timeDifference).toBeLessThan(1000); // Less than 1 second difference
  });

  it("should allow changing 'isApproved' status", async () => {
    const comment = new Comment({
      user: new mongoose.Types.ObjectId(),
      productId: new mongoose.Types.ObjectId(),
      content: "Approval test",
    });
    const savedComment = await comment.save();

    savedComment.isApproved = "approved";
    const updatedComment = await savedComment.save();

    expect(updatedComment.isApproved).toBe("approved");
  });
});
