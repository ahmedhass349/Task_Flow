import { useState, useEffect, useId } from "react";
import {
  User, Bell, Shield, Palette, Globe, Key, Trash2, Camera,
  Moon, Sun, Monitor, Mail, MessageSquare, CheckSquare, Save,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useSettings } from "../hooks/useSettings";
import { useAuth } from "../context/AuthContext";
import { getRememberMePreference, setRememberMePreference } from "../services/api";

/* ─────── types ─────── */
type Section = "profile" | "account" | "notifications" | "appearance" | "security" | "privacy";

interface Toggle {
  label: string;
  description: string;
  value: boolean;
}

/* ─────── helpers ─────── */
function SectionCard({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ToggleRow({
  label, description, value, onChange
}: Toggle & { onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        aria-label={label}
        aria-pressed={value}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
          value ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow transition-transform duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function InputField({
  label, value, onChange, type = "text", placeholder,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  );
}

/* ─────── nav items ─────── */
const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "profile",       label: "Profile",       icon: User      },
  { id: "account",       label: "Account",        icon: Key       },
  { id: "notifications", label: "Notifications",  icon: Bell      },
  { id: "appearance",    label: "Appearance",     icon: Palette   },
  { id: "security",      label: "Security",       icon: Shield    },
  { id: "privacy",       label: "Privacy",        icon: Globe     },
];

/* ═══════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════ */
export default function Settings() {
  const { refreshUser } = useAuth();
  const { profile, isLoading, error, updateProfile } = useSettings();

  // Refresh user data on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [rememberMeEnabled, setRememberMeEnabled] = useState<boolean>(getRememberMePreference());

  // Convert backend profile to form state
  const [profileForm, setProfileForm] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    company: profile?.company || "",
    country: profile?.country || "",
    phone: profile?.phone || "",
    timezone: profile?.timezone || "UTC",
  });

  // Update form when profile changes
  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email,
        company: profile.company || "",
        country: profile.country || "",
        phone: profile.phone || "",
        timezone: profile.timezone || "UTC",
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        avatarUrl: profile?.avatarUrl,
        company: profileForm.company,
        country: profileForm.country,
        phone: profileForm.phone,
        timezone: profileForm.timezone,
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleRememberMeChange = (enabled: boolean) => {
    setRememberMeEnabled(enabled);
    setRememberMePreference(enabled);
  };

  /* ── Notifications state ── */
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    emailTaskAssigned:   true,
    emailTaskCompleted:  false,
    emailWeeklyDigest:   true,
    emailProjectUpdates: true,
    pushTaskAssigned:    true,
    pushMentions:        true,
    pushDeadlines:       true,
    pushNewMessages:     false,
    inAppAll:            true,
    inAppSounds:         false,
  });
  const toggleNotif = (key: string) =>
    setNotifs((n) => ({ ...n, [key]: !n[key] }));

  /* ── Appearance state ── */
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [accentColor, setAccentColor] = useState("#155EEF");
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");

  /* ── Security state ── */
  const [twoFA, setTwoFA] = useState(false);
  const [sessions] = useState([
    { device: "Chrome on Windows", location: "Cairo, EG", lastActive: "Now",          current: true  },
    { device: "Safari on iPhone",  location: "Cairo, EG", lastActive: "2 hours ago",  current: false },
    { device: "Firefox on macOS",  location: "Dubai, AE", lastActive: "3 days ago",   current: false },
  ]);

  /* ── Privacy state ── */
  const [privacy, setPrivacy] = useState<Record<string, boolean>>({
    showOnlineStatus:    true,
    showProfileToTeam:   true,
    allowDataAnalytics:  true,
    shareActivityFeed:   false,
  });
  const togglePrivacy = (key: string) =>
    setPrivacy((p) => ({ ...p, [key]: !p[key] }));

  /* ── Password change state ── */
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  /* ════════════ render ════════════ */
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Page heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-500 mt-1">Manage your account preferences and configuration</p>
            </div>

            <div className="flex gap-6 items-start">
              {/* ── Left nav ── */}
              <nav className="w-52 flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden sticky top-6">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-100 last:border-0 ${
                      activeSection === id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </nav>

              {/* ── Right content ── */}
              <div className="flex-1 flex flex-col gap-6">

                {/* ══════════ PROFILE ══════════ */}
                {activeSection === "profile" && (
                  <>
                    <SectionCard title="Profile Picture">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="size-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold select-none">
                            AA
                          </div>
                          <button aria-label="Change profile picture" className="absolute bottom-0 right-0 size-7 bg-blue-600 rounded-full flex items-center justify-center shadow hover:bg-blue-700 transition-colors">
                            <Camera className="size-3.5 text-white" />
                          </button>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Demo User</p>
                          <p className="text-xs text-gray-500 mt-0.5">JPG, PNG or GIF · max 5 MB</p>
                          <div className="flex gap-2 mt-3">
                            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">Upload photo</button>
                            <button className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-50 transition-colors">Remove</button>
                          </div>
                        </div>
                      </div>
                    </SectionCard>

                    <SectionCard title="Personal Information">
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="First name" value={profileForm.firstName} onChange={(v) => setProfileForm({ ...profileForm, firstName: v })} />
                        <InputField label="Last name"  value={profileForm.lastName}  onChange={(v) => setProfileForm({ ...profileForm, lastName: v })} />
                        <InputField label="Email address" value={profileForm.email} onChange={(v) => setProfileForm({ ...profileForm, email: v })} type="email" />
                        <InputField label="Phone number" value={profileForm.phone} onChange={(v) => setProfileForm({ ...profileForm, phone: v })} type="tel" placeholder="+20 1xx xxx xxxx" />
                        <InputField label="Company" value={profileForm.company} onChange={(v) => setProfileForm({ ...profileForm, company: v })} />
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="settings-timezone" className="text-sm font-medium text-gray-700">Timezone</label>
                          <select
                            id="settings-timezone"
                            value={profileForm.timezone}
                            onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            {["Africa/Cairo","Europe/London","America/New_York","America/Los_Angeles","Asia/Dubai","Asia/Tokyo"].map(tz => (
                              <option key={tz} value={tz}>{tz}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Save className="size-4" /> Save changes
                        </button>
                      </div>
                    </SectionCard>

                    </>
                )}

                {/* ══════════ ACCOUNT ══════════ */}
                {activeSection === "account" && (
                  <>
                    <SectionCard title="Change Password">
                      <div className="flex flex-col gap-4 max-w-md">
                        <InputField label="Current password"  value={passwords.current}  onChange={(v) => setPasswords({ ...passwords, current: v })}  type="password" />
                        <InputField label="New password"      value={passwords.next}     onChange={(v) => setPasswords({ ...passwords, next: v })}     type="password" />
                        <InputField label="Confirm new password" value={passwords.confirm} onChange={(v) => setPasswords({ ...passwords, confirm: v })} type="password" />
                        {/* Strength indicator */}
                        {passwords.next.length > 0 && (
                          <div>
                            <div className="flex gap-1 mb-1">
                              {[1,2,3,4].map((i) => (
                                <div
                                  key={i}
                                  className={`h-1.5 flex-1 rounded-full ${
                                    passwords.next.length >= i * 3
                                      ? passwords.next.length < 8 ? "bg-red-400"
                                      : passwords.next.length < 12 ? "bg-yellow-400"
                                      : "bg-green-500"
                                      : "bg-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">
                              {passwords.next.length < 8 ? "Weak" : passwords.next.length < 12 ? "Fair" : "Strong"} password
                            </p>
                          </div>
                        )}
                        <div className="flex justify-end">
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                            <Key className="size-4" /> Update password
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                      <SectionCard title="Sign-in Preference">
                        <ToggleRow
                          label="Remember Me"
                          description="Keep me signed in on this device between app restarts"
                          value={rememberMeEnabled}
                          onChange={handleRememberMeChange}
                        />
                      </SectionCard>

                    <SectionCard title="Danger Zone">
                      <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                        <div>
                          <p className="text-sm font-semibold text-red-700">Delete account</p>
                          <p className="text-xs text-red-600 mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors ml-4 shrink-0">
                          <Trash2 className="size-4" /> Delete account
                        </button>
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ══════════ NOTIFICATIONS ══════════ */}
                {activeSection === "notifications" && (
                  <>
                    <SectionCard title={<span className="flex items-center gap-2"><Mail className="size-4 text-gray-500"/>Email Notifications</span>}>
                      {[
                        { key: "emailTaskAssigned",   label: "Task assigned to you",    description: "Receive an email when a task is assigned to you"            },
                        { key: "emailTaskCompleted",  label: "Task completed",           description: "Receive an email when a task you own is completed"          },
                        { key: "emailWeeklyDigest",   label: "Weekly digest",            description: "A summary of your activity every Monday morning"            },
                        { key: "emailProjectUpdates", label: "Project updates",          description: "Updates when project members make significant changes"       },
                      ].map(({ key, label, description }) => (
                        <ToggleRow key={key} label={label} description={description} value={notifs[key]} onChange={() => toggleNotif(key)} />
                      ))}
                    </SectionCard>

                    <SectionCard title={<span className="flex items-center gap-2"><Bell className="size-4 text-gray-500"/>Push Notifications</span>}>
                      {[
                        { key: "pushTaskAssigned", label: "Task assigned",    description: "In-browser push when a task is assigned to you"                  },
                        { key: "pushMentions",     label: "Mentions",         description: "When someone @mentions you in a comment"                         },
                        { key: "pushDeadlines",    label: "Upcoming deadlines", description: "Reminder 24 hours before a task is due"                        },
                        { key: "pushNewMessages",  label: "New messages",     description: "When you receive a direct message"                               },
                      ].map(({ key, label, description }) => (
                        <ToggleRow key={key} label={label} description={description} value={notifs[key]} onChange={() => toggleNotif(key)} />
                      ))}
                    </SectionCard>

                    <SectionCard title={<span className="flex items-center gap-2"><MessageSquare className="size-4 text-gray-500"/>In-App Notifications</span>}>
                      {[
                        { key: "inAppAll",    label: "All in-app notifications", description: "Show notification badge and panel entries"         },
                        { key: "inAppSounds", label: "Notification sounds",      description: "Play a sound when a new notification arrives"      },
                      ].map(({ key, label, description }) => (
                        <ToggleRow key={key} label={label} description={description} value={notifs[key]} onChange={() => toggleNotif(key)} />
                      ))}
                    </SectionCard>
                  </>
                )}

                {/* ══════════ APPEARANCE ══════════ */}
                {activeSection === "appearance" && (
                  <>
                    <SectionCard title="Theme">
                      <div className="grid grid-cols-3 gap-3">
                        {([
                          { id: "light",  icon: Sun,     label: "Light"  },
                          { id: "dark",   icon: Moon,    label: "Dark"   },
                          { id: "system", icon: Monitor, label: "System" },
                        ] as const).map(({ id, icon: Icon, label }) => (
                          <button
                            key={id}
                            onClick={() => setTheme(id)}
                            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-colors ${
                              theme === id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <Icon className={`size-6 ${theme === id ? "text-blue-600" : "text-gray-500"}`} />
                            <span className={`text-sm font-medium ${theme === id ? "text-blue-600" : "text-gray-600"}`}>{label}</span>
                          </button>
                        ))}
                      </div>
                    </SectionCard>

                    <SectionCard title="Accent color">
                      <div className="flex items-center gap-4">
                        {["#155EEF","#7C3AED","#DC2626","#059669","#D97706","#0891B2"].map((c) => (
                          <button
                            key={c}
                            onClick={() => setAccentColor(c)}
                            aria-label={`Accent color ${c}`}
                            aria-pressed={accentColor === c}
                            style={{ background: c }}
                            className={`size-8 rounded-full transition-transform ${accentColor === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"}`}
                          />
                        ))}
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="size-8 rounded border-0 cursor-pointer" />
                          Custom
                        </label>
                      </div>
                    </SectionCard>

                    <SectionCard title="Layout density">
                      <div className="flex gap-3">
                        {(["compact","comfortable","spacious"] as const).map((d) => (
                          <button
                            key={d}
                            onClick={() => setDensity(d)}
                            className={`flex-1 py-3 border-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                              density === d ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ══════════ SECURITY ══════════ */}
                {activeSection === "security" && (
                  <>
                    <SectionCard title="Two-Factor Authentication">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Authenticator app (TOTP)</p>
                          <p className="text-xs text-gray-500 mt-0.5">Use an app like Google Authenticator or Authy</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${twoFA ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {twoFA ? "Enabled" : "Disabled"}
                          </span>
                          <button
                            onClick={() => setTwoFA(!twoFA)}
                            aria-label="Two-factor authentication"
                            aria-pressed={twoFA}
                            className={`relative w-11 h-6 rounded-full transition-colors ${twoFA ? "bg-blue-600" : "bg-gray-200"}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow transition-transform ${twoFA ? "translate-x-5" : "translate-x-0"}`} />
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    <SectionCard title="Active Sessions">
                      <div className="flex flex-col gap-2">
                        {sessions.map((s, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className={`size-2.5 rounded-full ${s.current ? "bg-green-500" : "bg-gray-300"}`} />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{s.device}</p>
                                <p className="text-xs text-gray-500">{s.location} · {s.lastActive}</p>
                              </div>
                            </div>
                            {s.current ? (
                              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Current</span>
                            ) : (
                              <button className="text-xs text-red-500 hover:text-red-600 font-medium">Revoke</button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button className="mt-3 text-sm text-red-500 hover:text-red-600 font-medium">
                        Sign out of all other sessions
                      </button>
                    </SectionCard>

                    <SectionCard title="Login History">
                      <div className="flex flex-col gap-1">
                        {[
                          { event: "Successful login",  time: "Today, 09:14 AM", device: "Chrome · Cairo"  },
                          { event: "Successful login",  time: "Yesterday, 07:52 PM", device: "Safari · iPhone" },
                          { event: "Failed attempt",    time: "Mar 9, 11:30 AM",  device: "Unknown device"  },
                          { event: "Successful login",  time: "Mar 8, 03:00 PM",  device: "Firefox · macOS" },
                        ].map((row, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div className="flex items-center gap-2">
                              <CheckSquare className={`size-4 ${row.event.startsWith("Failed") ? "text-red-400" : "text-green-500"}`} />
                              <span className="text-sm text-gray-800">{row.event}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">{row.time}</p>
                              <p className="text-xs text-gray-400">{row.device}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ══════════ PRIVACY ══════════ */}
                {activeSection === "privacy" && (
                  <>
                    <SectionCard title="Visibility">
                      {[
                        { key: "showOnlineStatus",  label: "Show online status",          description: "Let team members see when you are active"                },
                        { key: "showProfileToTeam", label: "Public profile within team",  description: "Allow team members to view your full profile"            },
                        { key: "shareActivityFeed", label: "Share activity feed",         description: "Show your recent activity in the team feed"              },
                      ].map(({ key, label, description }) => (
                        <ToggleRow key={key} label={label} description={description} value={privacy[key]} onChange={() => togglePrivacy(key)} />
                      ))}
                    </SectionCard>

                    <SectionCard title="Data & Analytics">
                      {[
                        { key: "allowDataAnalytics", label: "Usage analytics", description: "Help us improve TaskFlow by sharing anonymous usage data" },
                      ].map(({ key, label, description }) => (
                        <ToggleRow key={key} label={label} description={description} value={privacy[key]} onChange={() => togglePrivacy(key)} />
                      ))}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 leading-relaxed">
                        We never sell your personal data. See our{" "}
                        <button type="button" onClick={() => {}} className="text-blue-600 hover:underline">Privacy Policy</button>{" "}
                        for full details on how your information is used.
                      </div>
                    </SectionCard>

                    <SectionCard title="Data Export">
                      <p className="text-sm text-gray-600 mb-4">
                        Download a copy of all your TaskFlow data including tasks, projects, and account information.
                      </p>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                        Request data export
                      </button>
                    </SectionCard>
                  </>
                )}

              </div>{/* /right content */}
            </div>{/* /flex */}
          </div>{/* /max-w */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
