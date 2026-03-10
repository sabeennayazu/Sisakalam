"use client";

import SettingSection from "@/components/Settings/SettingSection";

const activityLogs = [
  { id: 1, action: "Logged in via Web (Chrome)", time: "10 minutes ago", status: "Successful" },
  { id: 2, action: "Password changed", time: "2 days ago", status: "Secure" },
  { id: 3, action: "Logged in via Mobile (Sisakalam iOS)", time: "3 days ago", status: "Successful" },
  { id: 4, action: "Two-Factor Authentication enabled", time: "1 week ago", status: "Setup Complete" },
  { id: 5, action: "New device authorized: MacBook Pro", time: "2 weeks ago", status: "Approved" },
];

export default function ActivityLog() {
  return (
    <div className="space-y-6">
      <SettingSection 
        title="Activity History" 
        description="A chronological log of your account security actions and logins."
      >
        <div className="py-4 space-y-2">
          {activityLogs.map((log) => (
            <div 
                key={log.id} 
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <div>
                <h4 className="text-sm font-semibold text-black">{log.action}</h4>
                <p className="text-xs text-gray-500 mt-1">{log.time}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${
                log.status === "Successful" || log.status === "Secure" || log.status === "Approved" || log.status === "Setup Complete"
                ? "border-green-100 text-green-700 bg-green-50"
                : "border-gray-200 text-gray-500 bg-white"
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-4 text-center">
            <button className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">
                Load more activity
            </button>
        </div>
      </SettingSection>
    </div>
  );
}
