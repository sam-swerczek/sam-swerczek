import CreatePostClient from './CreatePostClient';

export default function NewPost() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Create New Post</h1>
        <p className="text-text-secondary">Write and publish a new blog post</p>
      </div>

      <div className="bg-background-secondary rounded-lg border border-gray-800 p-6">
        <CreatePostClient />
      </div>
    </div>
  );
}
