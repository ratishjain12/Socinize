import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Send,
  Eye,
  EyeOff,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Plus,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { TwitterPreview } from "../../components/ui/twitter-preview";

const NewDraftPage = () => {
  const [showPreview, setShowPreview] = useState(true); // Changed to true by default
  const [selectedPlatform, setSelectedPlatform] = useState("twitter");
  const [editorContent, setEditorContent] = useState(""); // Add state for editor content

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "What's happening?",
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[120px] text-gray-200",
      },
    },
    onUpdate: ({ editor }) => {
      // Update editor content state when content changes
      setEditorContent(editor.getHTML());
    },
  });

  // Force re-render when editor content changes
  useEffect(() => {
    if (editor) {
      setEditorContent(editor.getHTML());
    }
  }, [editor]);

  // Force re-render when platform changes
  useEffect(() => {
    // This will trigger a re-render of the preview when platform changes
  }, [selectedPlatform]);

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const getEditorContent = () => {
    return editorContent || editor?.getHTML() || "";
  };

  const platforms = [
    { id: "twitter", name: "Twitter", icon: Twitter, color: "text-blue-400" },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-400",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-500",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
    },
  ];

  return (
    <div className='p-6 md:p-8 w-full max-w-6xl mx-auto'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-2'>Create New Post</h1>
        <p className='text-gray-400'>
          Write and schedule your social media content
        </p>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        {/* Main Content Area */}
        <div className='xl:col-span-2 space-y-6'>
          {/* Platform Selection */}
          <div className='bg-gray-900 rounded-2xl border border-gray-800 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>Platform</h3>
            <div className='flex gap-3'>
              {platforms.map((platform) => {
                const IconComponent = platform.icon;
                const isTwitter = platform.id === "twitter";
                return (
                  <div key={platform.id} className='relative group'>
                    <Button
                      onClick={() =>
                        isTwitter && setSelectedPlatform(platform.id)
                      }
                      disabled={!isTwitter}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        selectedPlatform === platform.id
                          ? "border-blue-500 bg-blue-500/10 text-blue-400 cursor-pointer"
                          : isTwitter
                          ? "border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300 cursor-pointer"
                          : "border-gray-700 text-gray-600 cursor-not-allowed opacity-50"
                      }`}
                      neon={false}
                    >
                      <IconComponent size={20} />
                      <span className='font-medium'>{platform.name}</span>
                    </Button>
                    {!isTwitter && (
                      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                        Coming Soon
                        <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800'></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Editor */}
          <div className='bg-gray-900 rounded-2xl border border-gray-800 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-white'>Content</h3>
              <div className='flex gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowPreview(!showPreview)}
                  className='text-gray-400 cursor-pointer'
                  neon={false}
                >
                  {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            {/* Toolbar */}
            <div className='flex items-center gap-1 mb-4 p-2 bg-gray-800 rounded-lg'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`h-8 w-8 p-0 flex items-center justify-center ${
                  editor?.isActive("bold")
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
                neon={false}
              >
                <Bold size={14} />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`h-8 w-8 p-0 flex items-center justify-center ${
                  editor?.isActive("italic")
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
                neon={false}
              >
                <Italic size={14} />
              </Button>
              <div className='w-px h-6 bg-gray-600 mx-2' />
              <Button
                variant='ghost'
                size='sm'
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`h-8 w-8 p-0 flex items-center justify-center ${
                  editor?.isActive("bulletList")
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
                neon={false}
              >
                <List size={14} />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                className={`h-8 w-8 p-0 flex items-center justify-center ${
                  editor?.isActive("orderedList")
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
                neon={false}
              >
                <ListOrdered size={14} />
              </Button>
              <div className='w-px h-6 bg-gray-600 mx-2' />
              <Button
                variant='ghost'
                size='sm'
                onClick={addLink}
                className='h-8 w-8 p-0 flex items-center justify-center text-gray-400 hover:text-white'
                neon={false}
              >
                <LinkIcon size={14} />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={addImage}
                className='h-8 w-8 p-0 flex items-center justify-center text-gray-400 hover:text-white'
                neon={false}
              >
                <ImageIcon size={14} />
              </Button>
            </div>

            {/* Editor */}
            <div className='bg-gray-800 rounded-xl border border-gray-700 p-4 mb-4'>
              <EditorContent editor={editor} />
            </div>

            {/* Preview */}
            {showPreview && (
              <div className='border-t border-gray-700 pt-4'>
                <h4 className='text-sm font-medium text-gray-400 mb-3'>
                  Preview
                </h4>
                {selectedPlatform === "twitter" ? (
                  <TwitterPreview
                    content={getEditorContent()}
                    username='@your_handle'
                    displayName='Your Account'
                    timestamp='Just now'
                  />
                ) : (
                  <div className='bg-white rounded-xl p-4 text-black'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
                        <span className='text-white font-semibold'>U</span>
                      </div>
                      <div>
                        <div className='font-semibold'>Your Account</div>
                        <div className='text-sm text-gray-500'>Just now</div>
                      </div>
                    </div>
                    <div
                      className='text-sm mb-3 leading-relaxed prose prose-sm max-w-none text-black text-sm leading-relaxed [&>p]:mb-2 [&>p]:last:mb-0 [&>h1]:text-lg [&>h1]:font-semibold [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mb-1 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-1 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-2 [&>li]:mb-1 [&>a]:text-blue-600 [&>a]:underline [&>strong]:font-semibold [&>em]:italic [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono'
                      dangerouslySetInnerHTML={{ __html: getEditorContent() }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Schedule */}
          <div className='bg-gray-900 rounded-2xl border border-gray-800 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>Schedule</h3>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm font-medium text-gray-400 mb-1'>
                  Date
                </label>
                <input
                  type='date'
                  className='w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-400 mb-1'>
                  Time
                </label>
                <input
                  type='time'
                  className='w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2'
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='bg-gray-900 rounded-2xl border border-gray-800 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Quick Actions
            </h3>
            <div className='space-y-2'>
              <button className='w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-gray-800 group'>
                <div className='w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors'>
                  <Plus size={18} className='text-blue-400' />
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-white'>Save as Draft</div>
                  <div className='text-sm text-gray-400'>
                    Save for later editing
                  </div>
                </div>
              </button>

              <button className='w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-gray-800 group'>
                <div className='w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors'>
                  <Send size={18} className='text-green-400' />
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-white'>Post Now</div>
                  <div className='text-sm text-gray-400'>
                    Publish immediately
                  </div>
                </div>
              </button>

              <button className='w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-gray-800 group'>
                <div className='w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors'>
                  <Clock size={18} className='text-purple-400' />
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-white'>Schedule</div>
                  <div className='text-sm text-gray-400'>
                    Set future publish time
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDraftPage;
