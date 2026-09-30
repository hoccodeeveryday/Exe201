import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Icon from "@/components/ui/Icon";
import { Post } from "@/types/index";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(prev => prev - 1);
      setLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setLiked(true);
    }
  };

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-4">
        <Avatar size="sm">{post.author[0]}</Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xs text-darkbg">{post.author}</h3>
            {post.badge && (
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                {post.badge}
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted font-semibold mt-0.5 block">{post.time}</span>
        </div>
      </div>

      <p className="text-xs text-darkbg font-medium leading-relaxed mb-4">{post.content}</p>

      <div className="flex gap-2">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all duration-200 outline-none select-none
            ${liked ? "text-primary bg-primary-light" : "text-muted hover:bg-gray-100 hover:text-darkbg"}`}
        >
          <Icon n={liked ? "heart" : "heartO"} size={14} className={liked ? "text-primary" : "text-muted"} />
          <span>{likes} Thích</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-muted hover:bg-gray-100 hover:text-darkbg cursor-pointer transition-all duration-200 outline-none select-none">
          <Icon n="comment" size={14} className="text-muted" />
          <span>{post.comments} Bình luận</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-muted hover:bg-gray-100 hover:text-darkbg cursor-pointer transition-all duration-200 outline-none select-none">
          <Icon n="share" size={14} className="text-muted" />
          <span>Chia sẻ</span>
        </button>
      </div>
    </Card>
  );
};

export default PostCard;
