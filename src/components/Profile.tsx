// File: src/components/Profile.tsx | Component starts at line 1
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Mail,
  Phone,
  User,
  Building,
  Calendar,
  Lock,
  Key,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Shield,
  BookOpen,
  Users,
  Clock,
  Eye,
  EyeOff,
  Fingerprint,
} from "lucide-react";
import { Input, Button } from "@nextui-org/react";
import Barcode from "react-barcode";

interface SecurityFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  pin: string;
}

interface StatCard {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

export default function Profile() {
  const { auth } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangePin, setShowChangePin] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [securityData, setSecurityData] = useState<SecurityFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    pin: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!auth.token || !auth.user) {
    window.location.href = "/";
    return null;
  }

  const handleSecurityInputChange =
    (field: keyof SecurityFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSecurityData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://abes.platform.simplifii.com/api/v1/cards",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            card_unique_code: auth.user.username,
            action: "ChangePassword",
            current_password: securityData.currentPassword,
            password: securityData.newPassword,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Password changed successfully" });
        setSecurityData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setShowChangePassword(false);
      } else {
        setMessage({
          type: "error",
          text: data.msg || "Failed to change password",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An error occurred while changing password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePin = async () => {
    if (securityData.pin.length !== 4) {
      setMessage({ type: "error", text: "PIN must be 4 digits" });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://abes.platform.simplifii.com/api/v1/cards",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            card_unique_code: auth.user.username,
            action: "SetPin",
            pin: securityData.pin,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "PIN changed successfully" });
        setSecurityData((prev) => ({ ...prev, pin: "" }));
        setShowChangePin(false);
      } else {
        setMessage({ type: "error", text: data.msg || "Failed to change PIN" });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An error occurred while changing PIN",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats: StatCard[] = [
    {
      title: "Current Semester",
      value: `Semester ${auth.user.semester}`,
      icon: Clock,
      color: "bg-blue-500",
    },
    {
      title: "Section",
      value: `Section ${auth.user.section}`,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Academic Year",
      value: `Year -  ${auth.user.year}`,
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Batch",
      value: `${auth.user.batch - 4} - ${auth.user.batch}`,
      icon: GraduationCap,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-black transition-all duration-700 ${
        mounted ? "opacity-100" : "opacity-0"
      } lg:pl-64`}
    >
      <div className="absolute top-0 left-0 w-full h-auto pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
      </div>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your account information and security settings
          </p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${stat.color} bg-opacity-10 dark:bg-opacity-20`}
                >
                  <stat.icon
                    className={`w-5 h-5 ${stat.color.replace("bg-", "text-")}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="relative h-48">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=2000&q=80)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center space-x-4">
                  <img
                    src={auth.user.avatar}
                    alt={auth.user.name}
                    className="w-20 h-20 rounded-xl border-4 border-white dark:border-gray-800 shadow-lg"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {auth.user.name}
                    </h2>
                    <p className="text-gray-200">{auth.user.roll_number}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <Mail className="w-5 h-5 text-violet-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Email
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {auth.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <Phone className="w-5 h-5 text-violet-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Mobile
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {auth.user.mobile}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <Fingerprint className="w-5 h-5 text-violet-500" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Current PIN
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-900 dark:text-white font-mono">
                            {showPin ? auth.user.pin : "••••"}
                          </p>
                          <button
                            onClick={() => setShowPin(!showPin)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            {showPin ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <User className="w-5 h-5 text-violet-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Username
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {auth.user.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <Building className="w-5 h-5 text-violet-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Role
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {auth.user.role}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col items-center">
                      {/* <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Barcode for Username
                      </p> */}
                      <Barcode value={auth.user.username} height={50} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Security Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Shield className="w-5 h-5 text-violet-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Security Settings
                  </h2>
                </div>
                {message && (
                  <div
                    className={`p-3 mb-4 rounded-lg flex items-center space-x-2 ${
                      message.type === "success"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{message.text}</span>
                  </div>
                )}
                <div className="space-y-4">
                  {/* Password Section */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setShowChangePassword(!showChangePassword)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Lock className="w-5 h-5 text-violet-500" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Password
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Change your account password
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          showChangePassword ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showChangePassword && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                        <Input
                          type="password"
                          label="Current Password"
                          size="sm"
                          value={securityData.currentPassword}
                          onChange={handleSecurityInputChange(
                            "currentPassword"
                          )}
                        />
                        <Input
                          type="password"
                          label="New Password"
                          size="sm"
                          value={securityData.newPassword}
                          onChange={handleSecurityInputChange("newPassword")}
                        />
                        <Input
                          type="password"
                          label="Confirm Password"
                          size="sm"
                          value={securityData.confirmPassword}
                          onChange={handleSecurityInputChange(
                            "confirmPassword"
                          )}
                        />
                        <Button
                          color="primary"
                          size="sm"
                          onClick={handleChangePassword}
                          isLoading={loading}
                          className="w-full"
                        >
                          Update Password
                        </Button>
                      </div>
                    )}
                  </div>
                  {/* PIN Section */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setShowChangePin(!showChangePin)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Key className="w-5 h-5 text-violet-500" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            PIN
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Change your 4-digit PIN
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          showChangePin ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showChangePin && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                        <Input
                          type="password"
                          label="New 4-Digit PIN"
                          size="sm"
                          maxLength={4}
                          value={securityData.pin}
                          onChange={handleSecurityInputChange("pin")}
                        />
                        <Button
                          color="primary"
                          size="sm"
                          onClick={handleChangePin}
                          isLoading={loading}
                          className="w-full"
                        >
                          Update PIN
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
