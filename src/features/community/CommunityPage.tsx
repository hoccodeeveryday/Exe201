import React, { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import PostCard from "./components/PostCard";
import { POSTS } from "@/data/mock/posts";
import { Post } from "@/types/index";
import { useToast } from "@/hooks/useToast";

const CommunityPage: React.FC = () => {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = () => {
    if (!newContent.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const p: Post = {
        author: "Chủ nuôi (Bạn)",
        badge: "Thành viên",
        time: "Vừa xong",
        emoji: "🐾",
        content: newContent,
        img: "",
        likes: 0,
        comments: 0,
      };
      setPosts([p, ...posts]);
      setNewContent("");
      setLoading(false);
      showToast("Đăng bài viết mới thành công! 🐾");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader />

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Create Post */}
        <Card className="p-5 space-y-4">
          <div className="font-extrabold text-sm text-darkbg">Đăng thảo luận mới</div>
          <Textarea
            placeholder="Chia sẻ khoảnh khắc đáng yêu hoặc câu hỏi về cách chăm sóc Boss tại đây..."
            rows={3}
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
          />
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-muted font-semibold">🐾 Kết nối với 2,000+ chủ nuôi</span>
            <Button
              variant="primary"
              onClick={handlePost}
              disabled={!newContent.trim()}
              loading={loading}
              className="px-6 text-xs"
            >
              Đăng thảo luận
            </Button>
          </div>
        </Card>

        {/* Post Feed */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
