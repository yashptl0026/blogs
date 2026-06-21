import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Header from "@/components/Header";
import ModernFooter from "@/components/Footer/ModernFooter";
import Link from "next/link";
import { Heart, Bookmark, MessageSquare, Clock } from "lucide-react";

export const revalidate = 0; // Ensure data is always fresh

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/admin-access?callbackUrl=/profile");
  }

  const userId = (session.user as any).id;

  // Database has been removed. Likes, saved posts, and global comments history are no longer available.
  const likes: any[] = [];
  const savedPosts: any[] = [];
  const comments: any[] = [];

  return (
    <main className="min-h-screen flex flex-col bg-editorial-bg font-sans">
      <Header />
      
      {/* Profile Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-editorial-card border-b border-editorial-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
            {session.user.image ? (
              <img src={session.user.image} alt={session.user.name || "Profile"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-5xl font-bold font-display">
                {session.user.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black font-display text-editorial-text tracking-tight">
              {session.user.name}
            </h1>
            <p className="text-editorial-muted font-medium mt-1">{session.user.email}</p>
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <div className="bg-editorial-bg px-4 py-2 rounded-lg border border-editorial-border">
                <span className="font-bold text-editorial-text block">{likes.length}</span>
                <span className="text-xs text-editorial-muted uppercase tracking-wider font-semibold">Likes</span>
              </div>
              <div className="bg-editorial-bg px-4 py-2 rounded-lg border border-editorial-border">
                <span className="font-bold text-editorial-text block">{savedPosts.length}</span>
                <span className="text-xs text-editorial-muted uppercase tracking-wider font-semibold">Saves</span>
              </div>
              <div className="bg-editorial-bg px-4 py-2 rounded-lg border border-editorial-border">
                <span className="font-bold text-editorial-text block">{comments.length}</span>
                <span className="text-xs text-editorial-muted uppercase tracking-wider font-semibold">Comments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Saved Posts */}
          <div>
            <h2 className="text-2xl font-black font-display text-editorial-text mb-6 flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-blue-600" /> Saved Articles
            </h2>
            {savedPosts.length === 0 ? (
              <div className="bg-editorial-card p-8 rounded-2xl border border-dashed border-editorial-border text-center text-editorial-muted">
                You haven't saved any articles yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {savedPosts.map((save) => (
                  <Link key={save.postId} href={`/blog/${save.post.slug}`} className="group bg-editorial-card rounded-2xl overflow-hidden border border-editorial-border hover:shadow-xl transition-all block">
                    <div className="h-48 relative overflow-hidden">
                      <img src={save.post.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold font-display text-editorial-text line-clamp-2 mb-2 group-hover:text-blue-600">{save.post.titleEn}</h3>
                      <p className="text-sm text-editorial-muted line-clamp-2">{save.post.excerptEn}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Liked Posts */}
          <div>
            <h2 className="text-2xl font-black font-display text-editorial-text mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-600" /> Liked Articles
            </h2>
            {likes.length === 0 ? (
              <div className="bg-editorial-card p-8 rounded-2xl border border-dashed border-editorial-border text-center text-editorial-muted">
                You haven't liked any articles yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {likes.map((like) => (
                  <Link key={like.postId} href={`/blog/${like.post.slug}`} className="group bg-editorial-card rounded-2xl overflow-hidden border border-editorial-border hover:shadow-xl transition-all block">
                    <div className="h-48 relative overflow-hidden">
                      <img src={like.post.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold font-display text-editorial-text line-clamp-2 mb-2 group-hover:text-red-600">{like.post.titleEn}</h3>
                      <p className="text-sm text-editorial-muted line-clamp-2">{like.post.excerptEn}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Comments */}
          <div>
            <h2 className="text-2xl font-black font-display text-editorial-text mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-editorial-muted" /> My Comments
            </h2>
            {comments.length === 0 ? (
              <div className="bg-editorial-card p-8 rounded-2xl border border-dashed border-editorial-border text-center text-editorial-muted">
                You haven't posted any comments yet.
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-editorial-card p-6 rounded-2xl border border-editorial-border shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-editorial-muted font-semibold mb-3">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                    <p className="text-editorial-text leading-relaxed mb-4">"{comment.content}"</p>
                    <div className="text-sm text-editorial-muted bg-editorial-bg p-3 rounded-xl border border-editorial-border">
                      Posted on: <Link href={`/blog/${comment.post.slug}`} className="font-bold text-blue-600 hover:underline">{comment.post.titleEn}</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      <ModernFooter />
    </main>
  );
}
