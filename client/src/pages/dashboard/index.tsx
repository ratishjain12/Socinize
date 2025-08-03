import React from "react";
import { FileText, Clock, Send, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { GlowCard } from "../../components/ui/spotlight-card";

export const Dashboard: React.FC = () => {
  return (
    <div className='p-6 md:p-10 w-full'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-start mb-6'>
        <div className='flex flex-col gap-2 items-start'>
          <h1 className='text-3xl font-bold text-gray-300'>Dashboard</h1>
          <p className='text-gray-300'>Manage your Twitter posts</p>
        </div>
        <div className='flex items-center gap-4 mt-4 md:mt-0'>
          <Button
            variant={"default"}
            className='border border-[#2957cd] cursor-pointer bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'
          >
            <Plus size={20} />
            <span>New Draft</span>
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Drafts Section */}
        <GlowCard
          glowColor='blue'
          customSize={true}
          className='bg-[#0A0A0B] border border-neutral-700'
        >
          <div className='flex justify-between items-center mb-6'>
            <div className='flex items-center gap-3'>
              <FileText size={20} className='text-blue-400' />
              <h2 className='text-xl font-semibold text-gray-300'>Drafts</h2>
            </div>
            <a
              href='#'
              className='text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200'
            >
              View All
            </a>
          </div>

          <div className='flex flex-col gap-y-4'>
            <DraftItem
              title='Brainstorm new product feature ideas for #Schedule...'
              updatedAt='Jul 27, 2025 at 2:33 PM'
            />
            <hr className='border-neutral-700' />
            <DraftItem
              title="Don't forget to promote the webinar on Friday! #fre..."
              updatedAt='Jul 27, 2025 at 1:53 PM'
            />
          </div>
        </GlowCard>

        {/* Scheduled Posts Section */}
        <GlowCard
          glowColor='blue'
          customSize={true}
          className='bg-[#0A0A0B] border border-neutral-700'
        >
          <div className='flex justify-between items-center mb-6'>
            <div className='flex items-center gap-3'>
              <Clock size={20} className='text-purple-400' />
              <h2 className='text-xl font-semibold text-gray-300'>
                Scheduled Posts
              </h2>
            </div>
            <a
              href='#'
              className='text-purple-400 hover:text-purple-300 text-sm transition-colors duration-200'
            >
              View All
            </a>
          </div>

          <div className='flex flex-col gap-y-4'>
            <ScheduledItem
              title='Excited to announce dark mode support is coming so...'
              scheduledAt='Jul 27, 2025 at 4:03 PM'
              timeRemaining='in 1 hr 29 min'
            />
            <hr className='border-neutral-700' />
            <ScheduledItem
              title='Our weekly tips: Remember to save your tweets as d...'
              scheduledAt='Jul 27, 2025 at 6:33 PM'
              timeRemaining='in 3 hr 59 min'
            />
          </div>
        </GlowCard>

        {/* Published Posts Section */}
        <GlowCard
          glowColor='blue'
          customSize={true}
          className='bg-[#0A0A0B] border border-neutral-700'
        >
          <div className='flex justify-between items-center mb-6'>
            <div className='flex items-center gap-3'>
              <Send size={20} className='text-green-400' />
              <h2 className='text-xl font-semibold text-gray-300'>
                Published Posts
              </h2>
            </div>
            <a
              href='#'
              className='text-green-400 hover:text-green-300 text-sm transition-colors duration-200'
            >
              View All
            </a>
          </div>

          <div className='flex flex-col gap-y-4'>
            <PublishedItem
              title='We hit 10,000 users today! Thank you for all your ...'
              publishedAt='Jul 27, 2025 at 2:28 PM'
            />
            <hr className='border-neutral-700' />
            <PublishedItem
              title='Scheduler Dashboard v1.0 is live – schedule and ma...'
              publishedAt='Jul 27, 2025 at 10:48 AM'
            />
          </div>
        </GlowCard>
      </div>
    </div>
  );
};

// Component for draft items
const DraftItem = ({
  title,
  updatedAt,
}: {
  title: string;
  updatedAt: string;
}) => {
  return (
    <div className='group p-3 -m-3 transition-all duration-200'>
      <p className='font-medium text-gray-200 transition-colors duration-200 mb-2 text-start'>
        {title}
      </p>
      <div className='flex justify-between items-center'>
        <span className='text-sm text-gray-400'>Updated: {updatedAt}</span>
        <div className='flex gap-1'>
          <button className='text-gray-400 hover:text-blue-400 px-2 py-1 rounded transition-colors duration-200'>
            <Edit size={14} />
          </button>
          <button className='text-gray-400 hover:text-green-400 px-2 py-1 rounded transition-colors duration-200'>
            <Clock size={14} />
          </button>
          <button className='text-gray-400 hover:text-red-400 px-2 py-1 rounded transition-colors duration-200'>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Component for scheduled items
const ScheduledItem = ({
  title,
  scheduledAt,
  timeRemaining,
}: {
  title: string;
  scheduledAt: string;
  timeRemaining: string;
}) => {
  return (
    <div className='group p-3 -m-3 transition-all duration-200'>
      <p className='font-medium text-gray-200 transition-colors duration-200 mb-2 text-start'>
        {title}
      </p>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <span className='text-sm text-gray-400'>{scheduledAt}</span>
          <span className='text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded'>
            {timeRemaining}
          </span>
        </div>
        <div className='flex gap-1'>
          <button className='text-gray-400 hover:text-blue-400 px-2 py-1 rounded transition-colors duration-200'>
            <Edit size={14} />
          </button>
          <button className='text-gray-400 hover:text-red-400 px-2 py-1 rounded transition-colors duration-200'>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Component for published items
const PublishedItem = ({
  title,
  publishedAt,
}: {
  title: string;
  publishedAt: string;
}) => {
  return (
    <div className='group p-3 -m-3 transition-all duration-200'>
      <p className='font-medium text-gray-200 transition-colors duration-200 mb-2 text-start'>
        {title}
      </p>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 rounded-full bg-green-500'></div>
          <span className='text-sm text-gray-400'>Published {publishedAt}</span>
        </div>
      </div>
    </div>
  );
};
