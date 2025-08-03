import { useState } from "react";
import { BigCalendar } from "../../components/ui/big-calendar";
import { Button } from "../../components/ui/button";
import { Plus, Filter, Search } from "lucide-react";

const ScheduledPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample scheduled posts data
  const scheduledPosts = [
    {
      id: 1,
      title: "Product Launch Announcement",
      platform: "Twitter",
      scheduledDate: new Date(2024, 11, 15, 14, 30), // Dec 15, 2:30 PM
      status: "scheduled",
    },
    {
      id: 2,
      title: "Weekly Update Post",
      platform: "Twitter",
      scheduledDate: new Date(2024, 11, 22, 9, 0), // Dec 22, 9:00 AM
      status: "scheduled",
    },
    {
      id: 3,
      title: "Holiday Promotion",
      platform: "Twitter",
      scheduledDate: new Date(2024, 11, 25, 18, 0), // Dec 25, 6:00 PM
      status: "draft",
    },
  ];

  const handleSchedulePost = () => {
    if (selectedDate && selectedTime) {
      console.log("Scheduling post for:", selectedDate, "at", selectedTime);
      // Add your scheduling logic here
    }
  };

  return (
    <div className='p-6 md:p-8 w-full'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-2'>Scheduled Posts</h1>
        <p className='text-gray-400'>
          Manage and schedule your social media content
        </p>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
        {/* Main Calendar Area */}
        <div className='xl:col-span-2'>
          <BigCalendar
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
          />
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Search and Filter */}
          <div className='bg-gray-900 rounded-2xl border border-gray-800 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Search & Filter
            </h3>
            <div className='space-y-4'>
              <div className='relative'>
                <Search
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={16}
                />
                <input
                  type='text'
                  placeholder='Search posts...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 bg-gray-800 rounded-xl border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none'
                />
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-gray-400 hover:text-white flex justify-center items-center'
                  neon={false}
                >
                  <Filter size={16} className='mr-2' />
                  All Platforms
                </Button>
              </div>
            </div>
          </div>

          {/* Scheduled Posts List */}
          <div className='bg-gray-900 rounded-2xl border border-gray-800 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Upcoming Posts
            </h3>
            <div className='space-y-3'>
              {scheduledPosts.map((post) => (
                <div
                  key={post.id}
                  className='p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <h4 className='font-medium text-white'>{post.title}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        post.status === "scheduled"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-400'>
                    <span>{post.platform}</span>
                    <span>•</span>
                    <span>{post.scheduledDate.toLocaleDateString()}</span>
                    <span>•</span>
                    <span>
                      {post.scheduledDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className='bg-gray-900 rounded-2xl border border-gray-800 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Quick Actions
            </h3>
            <div className='flex justify-center'>
              <Button
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center'
                onClick={handleSchedulePost}
                disabled={!selectedDate || !selectedTime}
                neon={false}
              >
                <Plus size={16} className='mr-2' />
                Schedule New Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledPage;
