import React, { useState, useEffect } from 'react';

const Home = () => {
  const [greeting, setGreeting] = useState('');
  const [date, setDate] = useState(new Date());
  const [classes, setClasses] = useState([
    { id: 1, code: 'CE2205', name: 'Numerical', time: '04:00 PM', status: '--', credits: 3, type: 'upcoming' },
    { id: 2, code: 'CE2202', name: 'Soil Mechanics', time: '05:00 PM', status: '--', credits: 4, type: 'upcoming' },
    { id: 3, code: 'CE2201', name: 'Structural Analysis', time: '01:00 PM', status: 'Attended', credits: 4, type: 'past' },
    { id: 4, code: 'CE2204', name: 'Water Resource', time: '02:00 PM', status: 'Attended', credits: 3, type: 'past' }
  ]);

  const [summaryData, setSummaryData] = useState({
    labels: ['CE2201', 'CE2202', 'CE2203', 'CE2204', 'CE2205', 'IDE'],
    data: [95, 80, 87, 76, 90, 60] // Sample data
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(',', '');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-Plus Jakarta Sans overflow-y-auto" style={{ height: '100vh' }}>
      <div className="text-2xl font-bold text-[#0E2C75]">{greeting}</div>
      <div className="text-gray-500">{formatDate(date)}</div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-[#455068] font-medium">Total Courses</div>
          <div className="text-2xl font-bold text-purple-800">06</div>
          <div className="text-sm text-gray-400">1 Elective</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-gray-500">Attendance</div>
          <div className="text-2xl font-bold text-red-500">60%</div>
          <div className="text-sm text-gray-400">24% Absent</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-gray-500">Requested Leaves</div>
          <div className="text-2xl font-bold text-blue-500">17</div>
          <div className="text-sm text-gray-400">11 Approved</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-lg font-semibold text-gray-700">Today's Classes</div>

        <div className="mt-2">
          <div className="text-sm text-gray-500">Upcoming</div>
          {classes.filter(cls => cls.type === 'upcoming').map(cls => (
            <div key={cls.id} className="bg-white p-4 mt-2 rounded-lg shadow-md flex justify-between">
              <div>
                <div className="text-[#0E2C75] font-semibold">{cls.code}</div>
                <div className="text-gray-700">{cls.name}</div>
                <div className="text-gray-400 text-sm">Credits: {cls.credits}</div>
              </div>
              <div className="text-gray-700 font-medium">{cls.time}</div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500">Past</div>
          {classes.filter(cls => cls.type === 'past').map(cls => (
            <div key={cls.id} className="bg-white p-4 mt-2 rounded-lg shadow-md flex justify-between">
              <div>
                <div className="text-[#0E2C75] font-semibold">{cls.code}</div>
                <div className="text-gray-700">{cls.name}</div>
                <div className="text-gray-400 text-sm">Credits: {cls.credits}</div>
              </div>
              <div className={cls.status === 'Attended' ? 'text-green-500' : 'text-red-500'}>
                {cls.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <div className="text-lg font-semibold text-gray-700 mb-4">Summary</div>
        {summaryData.labels.map((label, index) => (
          <div key={index} className="flex items-center mb-4">
            <div
              className={`text-white px-2 py-1 rounded-l-lg text-sm ${summaryData.data[index] < 75 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: '50px' }}
            >
              {summaryData.data[index]}%
            </div>
            <div className="flex-grow h-6 bg-gray-200 rounded-r-lg relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full ${summaryData.data[index] < 75 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${summaryData.data[index]}%` }}
              />
              <div
                className="absolute top-0 right-0 h-full"
                style={{
                  width: `${100 - summaryData.data[index]}%`,
                  backgroundImage: 'repeating-linear-gradient(45deg, #d1d5db 0, #d1d5db 1px, transparent 1px, transparent 4px)',
                  backgroundColor: '#f3f4f6'
                }}
              />
            </div>
            <div className="ml-2 text-gray-700 w-20 text-sm">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
