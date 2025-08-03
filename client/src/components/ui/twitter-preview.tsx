import React from "react";
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart3,
  Bookmark,
  Share,
} from "lucide-react";

interface TwitterPreviewProps {
  content: string;
  username?: string;
  displayName?: string;
  profileImage?: string;
  timestamp?: string;
}

export const TwitterPreview: React.FC<TwitterPreviewProps> = ({
  content,
  username = "@your_handle",
  displayName = "Your Account",
  profileImage,
  timestamp = "2h",
}) => {
  return (
    <div className='bg-black text-white max-w-md mx-auto rounded-lg border border-gray-800'>
      {/* Profile Section */}
      <div className='flex items-start p-4'>
        {/* Profile Picture */}
        <div className='flex-shrink-0 mr-3'>
          {profileImage ? (
            <img
              src={profileImage}
              alt='Profile'
              className='w-12 h-12 rounded-full'
            />
          ) : (
            <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center'>
              <span className='text-white font-semibold text-lg'>
                {displayName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* User Info and Content */}
        <div className='flex-1 min-w-0'>
          {/* User Header */}
          <div className='flex items-center mb-1'>
            <span className='font-bold text-white mr-2'>{displayName}</span>
            <svg
              className='w-4 h-4 text-blue-400'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.195-.195-.195-.512 0-.707s.512-.195.707 0l1.768 1.768 3.853-5.78c.145-.217.382-.334.625-.334.143 0 .288.04.416.126l.115.094 2.415 2.415c.195.195.195.512 0 .707s-.512.195-.707 0l-1.768-1.768-3.853 5.78z' />
            </svg>
            <span className='text-gray-500 text-sm'>{username}</span>
            <span className='text-gray-500 text-sm mx-1'>·</span>
            <span className='text-gray-500 text-sm'>{timestamp}</span>
          </div>

          {/* Content */}
          <div className='text-white text-base leading-relaxed mb-3'>
            <div
              className='whitespace-pre-wrap break-words text-start text-white text-base leading-relaxed [&>p]:mb-2 [&>p]:last:mb-0 [&>h1]:text-lg [&>h1]:font-semibold [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mb-1 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-1 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-2 [&>li]:mb-1 [&>a]:text-blue-400 [&>a]:underline [&>strong]:font-semibold [&>em]:italic [&>blockquote]:border-l-4 [&>blockquote]:border-gray-600 [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-gray-400 [&>code]:bg-gray-700 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono'
              dangerouslySetInnerHTML={{
                __html: content
                  .replace(/(@\w+)/g, '<span class="text-blue-400">$1</span>')
                  .replace(/(#\w+)/g, '<span class="text-blue-400">$1</span>'),
              }}
            />
          </div>

          {/* Engagement Metrics */}
          <div className='flex items-center justify-between text-gray-500 text-sm pt-3 mt-2'>
            <div className='flex items-center space-x-8'>
              {/* Comments */}
              <div className='flex items-center space-x-2 hover:text-blue-400 cursor-pointer transition-colors'>
                <MessageCircle size={18} />
                <span className='text-sm opacity-0'>68</span>
              </div>

              {/* Retweets */}
              <div className='flex items-center space-x-2 hover:text-green-400 cursor-pointer transition-colors'>
                <Repeat2 size={18} />
                <span className='text-sm opacity-0'>66</span>
              </div>

              {/* Likes */}
              <div className='flex items-center space-x-2 hover:text-pink-400 cursor-pointer transition-colors'>
                <Heart size={18} />
                <span className='text-sm opacity-0'>1.2K</span>
              </div>

              {/* Views */}
              <div className='flex items-center space-x-2 hover:text-blue-400 cursor-pointer transition-colors'>
                <BarChart3 size={18} />
                <span className='text-sm opacity-0'>33K</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center space-x-4'>
              <Bookmark
                size={18}
                className='hover:text-blue-400 cursor-pointer transition-colors'
              />
              <Share
                size={18}
                className='hover:text-blue-400 cursor-pointer transition-colors'
              />
            </div>
          </div>
        </div>

        {/* More Options */}
        <div className='flex-shrink-0 ml-2'>
          <button className='text-gray-500 hover:text-white transition-colors'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 18.042c-.553 0-1-.447-1-1v-5.5c0-.553.447-1 1-1s1 .447 1 1v5.5c0 .553-.447 1-1 1zM12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
