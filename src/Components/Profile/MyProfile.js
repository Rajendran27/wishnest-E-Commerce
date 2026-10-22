import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import {
  EditOutlined,
  SaveOutlined,
  LogoutOutlined,
  AddCircleOutline,
} from "@mui/icons-material";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../LoginAuthentication/Auth/Firebase";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import "./MyProfile.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Fetch or create profile
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        const localAvatar = localStorage.getItem(`avatar_${user.uid}`);

        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            ...data,
            avatar:
              localAvatar || data.avatar || "default",
          });
        } else {
          const newProfile = {
            name: user.displayName || "New User",
            email: user.email || "",
            phone: "",
            address: "",
            avatar: localAvatar || "default",
            joinedAt: new Date().toISOString(),
          };
          await setDoc(userRef, newProfile);
          setProfile(newProfile);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    fetchProfile();
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save changes to Firestore
  const handleSave = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), profile, { merge: true });
      setEditMode(false);
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  // Handle image upload and save to localStorage
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const imageBase64 = reader.result;
      localStorage.setItem(`avatar_${user.uid}`, imageBase64);
      const updatedProfile = { ...profile, avatar: imageBase64 };
      setProfile(updatedProfile);
      await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });
      // Update navbar instantly
      localStorage.setItem("navbarProfileImage", imageBase64);
    };
    reader.readAsDataURL(file);
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("navbarProfileImage");
    window.location.href = "/login";
  };

  if (loading || !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box className="profilePage" style={{ marginLeft: 240, marginTop: 64, padding: 20 }}>
      <Box className="profileCard">
        <Box className="avatarSection" sx={{ position: "relative", display: "inline-block" }}>
          {profile.avatar === "default" ? (
            <Avatar className="avatar">
              <AccountCircleTwoToneIcon sx={{ fontSize: 100 }} />
            </Avatar>
          ) : (
            <Avatar src={profile.avatar} alt={profile.name} className="avatar" />
          )}
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 4,
              right: 4,
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": { backgroundColor: "#115293" },
            }}
          >
            <AddCircleOutline />
            <input type="file" hidden accept="image/*" onChange={handleUpload} />
          </IconButton>
        </Box>

        <Typography variant="h5" className="username">
          {profile.name}
        </Typography>
        <Typography variant="body2" className="memberSince">
          WishNest Member since {new Date(profile.joinedAt).getFullYear()}
        </Typography>

        <Stack spacing={2} className="profileDetails">
          <TextField label="Full Name" name="name" value={profile.name} onChange={handleChange} fullWidth disabled={!editMode} />
          <TextField label="Email" name="email" value={profile.email} onChange={handleChange} fullWidth disabled />
          <TextField label="Phone" name="phone" value={profile.phone} onChange={handleChange} fullWidth disabled={!editMode} />
          <TextField label="Address" name="address" value={profile.address} onChange={handleChange} fullWidth disabled={!editMode} />
        </Stack>

        <Box className="profileActions">
          <Button
            variant="contained"
            startIcon={editMode ? <SaveOutlined /> : <EditOutlined />}
            onClick={editMode ? handleSave : () => setEditMode(true)}
            className="editBtn"
          >
            {editMode ? "Save Changes" : "Edit Profile"}
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutOutlined />}
            onClick={handleLogout}
            className="logoutBtn"
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
