"use client";
import { Button } from "@mda/components";
import { useAppSelector } from "../../../lib/hooks";
import { useState } from "react";
export default function UserVitalSettings() {
  const user = useAppSelector((state) => state.user);
  const [preDelete, setPreDelete] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <div>
      <h1 className="text-2xl font-bold">User Settings</h1>
      <div id="user-settings-form">
        <form className="flex flex-col space-y-4 w-64 mt-4">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button label="Update Settings" onClick={() => {}} />
        </form>
      </div>
      <div className="mt-8 border-t pt-4">
        <p className="text-red-500 font-bold">***Danger Zone***</p>
        <Button label="Delete Account" onClick={() => setPreDelete(true)} />
        <p className="text-sm text-gray-500 mt-2">
          Once you delete your account, there is no going back. <br /> You will
          lose all of your data and there will be no way to get it back. <br />{" "}
          Please be certain.
        </p>
        {preDelete && (
          <div className="mt-4">
            <p className="text-red-600 font-bold">
              Are you absolutely sure you want to delete your account? This
              action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button label="Yes, Delete My Account" onClick={() => {}} />
              <Button label="Cancel" onClick={() => setPreDelete(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
