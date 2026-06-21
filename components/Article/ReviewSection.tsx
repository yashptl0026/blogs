"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Mail, CheckCircle2 } from "lucide-react";
import { Review } from "@/types/blog";

interface ReviewSectionProps {
  initialReviews: Review[];
  postTitle: string;
}

export default function ReviewSection({ initialReviews, postTitle }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  // Stats calculation
  const totalReviews = reviews.length;
  const avgRating = totalReviews 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !name || !email || !comment) return;

    startTransition(async () => {
      // Simulate API call and Email dispatch delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newReview: Review = {
        id: `r-${Date.now()}`,
        name,
        email,
        rating,
        comment,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };

      // Mock Email Dispatch Output to console for validation
      console.log(
        `[Email Dispatch] Review Alert: "${name}" (${email}) submitted a new ${rating}-star review for the post "${postTitle}". Comments: "${comment}"`
      );

      setReviews((prev) => [newReview, ...prev]);
      setSubmitted(true);
      
      // Reset form
      setRating(0);
      setComment("");
      setName("");
      setEmail("");

      // Hide success notification after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-16 border-t border-editorial-border space-y-12">
      {/* Header and Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-editorial-border pb-8">
        <div className="md:col-span-6 space-y-2 text-center md:text-left">
          <span className="text-[10px] font-bold tracking-widest text-editorial-muted uppercase">Feedback</span>
          <h3 className="font-display text-2xl font-black text-editorial-text uppercase tracking-tight">Reader Reviews</h3>
        </div>
        
        {/* Aggregated Rating Stats */}
        <div className="md:col-span-6 flex items-center justify-center md:justify-end gap-6">
          <div className="text-center md:text-right">
            <span className="text-5xl font-display font-black text-editorial-text">{avgRating}</span>
            <span className="text-xs text-editorial-muted block">out of 5.0</span>
          </div>
          <div className="h-12 w-[1px] bg-editorial-border" />
          <div>
            <div className="flex gap-0.5 text-editorial-text">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? "fill-black text-black" : "text-editorial-border"}`} 
                />
              ))}
            </div>
            <span className="text-xs text-editorial-muted mt-1 block">{totalReviews} reviews submitted</span>
          </div>
        </div>
      </div>

      {/* Write a Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-editorial-card p-6 border border-editorial-border">
        <h4 className="font-display text-sm font-black tracking-wider uppercase text-editorial-text">Write a review</h4>
        
        {/* Interactive Star Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-editorial-muted font-medium">Your Rating:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform duration-100 hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${
                    s <= (hoverRating || rating) ? "fill-black text-black" : "text-editorial-border"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Input Text fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="name-input" className="text-[10px] font-bold text-editorial-muted uppercase tracking-wider block">Name</label>
            <input
              id="name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full bg-white border border-editorial-border px-3 py-2 text-xs focus:border-editorial-text focus:outline-none rounded-none text-editorial-text"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email-input" className="text-[10px] font-bold text-editorial-muted uppercase tracking-wider block">Email</label>
            <input
              id="email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jane@example.com"
              className="w-full bg-white border border-editorial-border px-3 py-2 text-xs focus:border-editorial-text focus:outline-none rounded-none text-editorial-text"
            />
          </div>
        </div>

        {/* Review Comments */}
        <div className="space-y-1">
          <label htmlFor="comment-input" className="text-[10px] font-bold text-editorial-muted uppercase tracking-wider block">Comment</label>
          <textarea
            id="comment-input"
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts on the article..."
            className="w-full bg-white border border-editorial-border px-3 py-2 text-xs focus:border-editorial-text focus:outline-none rounded-none text-editorial-text resize-none"
          />
        </div>

        {/* Submit triggers */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isPending || rating === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-editorial-text text-white px-6 py-3 hover:bg-editorial-muted transition-colors duration-300 font-display text-[9px] font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {isPending ? "Submitting..." : "Submit Review"}
          </button>
          
          {submitted && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-green-600 text-xs font-semibold"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Review submitted successfully! Notification email dispatched.</span>
            </motion.div>
          )}
        </div>
      </form>

      {/* Review Entries List */}
      <div className="space-y-6">
        <h4 className="font-display text-sm font-black tracking-wider uppercase text-editorial-text">Reader Comments ({totalReviews})</h4>
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {reviews.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="p-5 border border-editorial-border bg-white text-left space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-xs text-editorial-text">{r.name}</h5>
                    <span className="text-[10px] text-editorial-muted">{r.date}</span>
                  </div>
                  <div className="flex gap-0.5 text-editorial-text">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-black text-black" : "text-editorial-border"}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-editorial-muted font-light leading-relaxed font-sans">{r.comment}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
