import React from 'react'
import { useEffect } from 'react';
import { Button, TextField, Tab, Box, Select } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { fetchUserByEmail, changeUserFields, deleteFileFromS3, uploadFileToS3 } from '../utils/utils.js';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

function JobSeekerSettings() {

  const auth = getAuth();
  const email = auth.currentUser?.email;

  const [imageCooldown, setImageCooldown] = React.useState(0);
  const [resumeCooldown, setResumeCooldown] = React.useState(0);
  const [userObj, setUserObj] = React.useState(null);
  const [value, setValue] = React.useState('1');
  const [name, setName] = React.useState(userObj?.name || '');
  const [description, setDescription] = React.useState(userObj?.description || '');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [address, setAddress] = React.useState(userObj?.address || {});
  const [phone, setPhone] = React.useState(userObj?.phoneNumber || '');
  const [profileImageUrl, setProfileImageUrl] = React.useState(userObj?.profileImageUrl || '');
  const [newProfileImageFile, setNewProfileImageFile] = React.useState(null);
  const [profileImageFile, setProfileImageFile] = React.useState(null);
  const [newResumeFile, setNewResumeFile] = React.useState(null);
  const [resumeUrl, setResumeUrl] = React.useState(null);

  useEffect(() => {
    const restoreCooldown = (key, setFn) => {
      const savedEndTime = localStorage.getItem(key);

      if (savedEndTime) {
        const remaining = Math.floor((savedEndTime - Date.now()) / 1000);

        if (remaining > 0) {
          setFn(remaining);
        } else {
          localStorage.removeItem(key);
        }
      }
    };

    restoreCooldown("imageCooldownEnd", setImageCooldown);
    restoreCooldown("resumeCooldownEnd", setResumeCooldown);
  }, []);

  useEffect(() => {
    const runTimer = (cooldown, setFn, key) => {
      if (cooldown <= 0) return;

      const timer = setInterval(() => {
        setFn(prev => {
          if (prev <= 1) {
            localStorage.removeItem(key);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    };

    const imageTimer = runTimer(imageCooldown, setImageCooldown, "imageCooldownEnd");
    const resumeTimer = runTimer(resumeCooldown, setResumeCooldown, "resumeCooldownEnd");

    return () => {
      imageTimer && imageTimer();
      resumeTimer && resumeTimer();
    };
  }, [imageCooldown, resumeCooldown]);

  useEffect(() => {
    const fetchUser = async () => {
      if (email) {
        const user = await fetchUserByEmail(email);
        setUserObj(user);
      }
    };
    fetchUser();
  }, [email]);

  useEffect(() => {
    if (userObj) {
      setName(userObj.name || '');
      setDescription(userObj.description || '');
      setResumeUrl(userObj.resumeUrl || '');
      setAddress(userObj.address || '');
      setPhone(userObj.phoneNumber || '');
      setProfileImageUrl(userObj.profileImageUrl || '');
    }
  }, [userObj]);

  useEffect(() => {
    if (value === "1" && userObj) {
      setName(userObj.name || '');
      setDescription(userObj.description || '');
      setResumeUrl(userObj.resumeUrl || '');
      setAddress(userObj.address || {});
      setPhone(userObj.phoneNumber || '');
      setProfileImageUrl(userObj.profileImageUrl || '');
    }

    if (value === "2") {
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [value, userObj]);

  const handleUpdateResume = async (e) => {
    e.preventDefault();

    if (resumeCooldown > 0) return;

    const isConfirmed = window.confirm('Are you sure you want to update your resume?');

    if (isConfirmed) {
      // Perform the update logic here
      console.log(`Updating resume file to: ${newResumeFile.name}`);
      console.log("Current resume URL:", userObj.resumeUrl);
      await deleteFileFromS3(userObj.resumeUrl);
      const newUrl = await uploadFileToS3(newResumeFile);
      await changeUserFields(auth.currentUser, userObj, { resumeUrl: newUrl })
      setResumeUrl(newUrl);

      const endTime = Date.now() + 30000;
      localStorage.setItem("resumeCooldownEnd", endTime);
      setResumeCooldown(30);
    }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    const isConfirmed = window.confirm(`Are you sure you want to update your name to "${name}"?`);

    if (isConfirmed) {
      // Perform the update logic here
      console.log(`Updating name to: ${name}`);
      await changeUserFields(auth.currentUser, userObj, { name })
    }
  };

  const handleUpdateProfileImageUrl = async (e) => {
    e.preventDefault();

    if (imageCooldown > 0) return;

    const isConfirmed = window.confirm('Are you sure you want to update your profile image?');

    if (isConfirmed) {
      // Perform the update logic here
      console.log(`Updating profile image URL to: ${newProfileImageFile.name}`);
      await deleteFileFromS3(userObj.profileImageUrl);
      const newUrl = await uploadFileToS3(newProfileImageFile);
      await changeUserFields(auth.currentUser, userObj, { profileImageUrl: newUrl })
      setProfileImageUrl(newUrl);
      setProfileImageFile(newProfileImageFile);
      setNewProfileImageFile(null);

      const endTime = Date.now() + 30000;
      localStorage.setItem("imageCooldownEnd", endTime);
      setImageCooldown(30);
    }
  };

  const handleUpdateDescription = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    const isConfirmed = window.confirm(`Are you sure you want to update your description to "${description}"?`);

    if (isConfirmed) {
      // Perform the update logic here
      console.log(`Updating description to: ${description}`);
      await changeUserFields(auth.currentUser, userObj, { description })
    }

  };

  const handleUpdatePhone = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    const isConfirmed = window.confirm(`Are you sure you want to update your phone number to "${phone}"?`);

    if (isConfirmed) {
      // Perform the update logic here
      console.log(`Updating phone number to: ${phone}`);
      await changeUserFields(auth.currentUser, userObj, { phoneNumber: phone })
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    const isConfirmed = window.confirm(`Are you sure you want to update your address to "${address.address1}, ${address.address2}, ${address.city}, ${address.state} ${address.zip}"?`);

    if (isConfirmed) {
      // Perform the update logic here
      console.log(`Updating address to: ${address.address1}, ${address.address2}, ${address.city}, ${address.state} ${address.zip}`);
      await changeUserFields(auth.currentUser, userObj, { address })
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      return;
    }

    if (password !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    const isConfirmed = window.confirm('Are you sure you want to change your password?');

    if (isConfirmed) {
      // Perform the password change logic here
      console.log(`Changing password from: ${password} to ${confirmPassword}`);
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      try {
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, password);
        await changeUserFields(auth.currentUser, userObj, { password });
        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
        alert("Password changed successfully!");
      } catch (error) {
        console.error("Error changing password:", error);
        alert("The entered current password is incorrect. Please try again.");
      }

    }
  };

  return (
    <div className='container-fluid d-flex justify-content-center align-items-center min-vh-100'>
      <TabContext value={value}>
        <Box sx={{ display: "flex", bgcolor: window.COMPLEMENTARY_COLOR, borderRadius: 2, p: 2, mt: 2, width: "80%", maxWidth: 800 }}>

          <TabList
            orientation="vertical"
            onChange={(e, newValue) => setValue(newValue)}
            sx={{ borderRight: 1, borderColor: "divider", minWidth: 150 }}
          >
            <Tab label="Profile" value="1" />
            <Tab label="Account" value="2" />
          </TabList>

          <TabPanel value="1" sx={{}}>
            <div className="my-4" style={{ border: "1px solid #c0c0c0", borderRadius: "4px", padding: "16px", boxSizing: "border-box" }}>
              <label htmlFor="profileImage" className="form-label d-block text-center">Profile Image</label>
              <img
                src={profileImageFile ? URL.createObjectURL(profileImageFile) : profileImageUrl || null}
                alt="Profile Preview"
                crossOrigin="anonymous"
                className="d-block mx-auto mb-2"
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", border: "2px solid #fff" }}
              />
              <form onSubmit={handleUpdateProfileImageUrl}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    className="form-control"
                    style={{ flexGrow: 1 }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setNewProfileImageFile(file);
                        setProfileImageFile(file);
                      }
                    }}
                  />
                  <Button type="submit" variant="contained" color="primary" disabled={!newProfileImageFile || imageCooldown > 0}>
                    {imageCooldown > 0 ? `Wait ${imageCooldown}s` : "Update"}
                  </Button>
                </Box>
              </form>
            </div>

            <div className="my-4" style={{ border: "1px solid #c0c0c0", borderRadius: "4px", padding: "16px", boxSizing: "border-box" }}>
              <label htmlFor="resumeFile" className="form-label d-block text-center">Resume</label>
              {resumeUrl && <p className='text-center'>{resumeUrl.slice(resumeUrl.indexOf('_') + 1)}</p>}
              <form onSubmit={handleUpdateResume}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <input
                    type="file"
                    id="resumeFile"
                    accept=".pdf,.doc,.docx"
                    className="form-control"
                    style={{ flexGrow: 1 }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setNewResumeFile(file);
                      }
                    }}
                  />
                  <Button type="submit" variant="contained" color="primary" disabled={!newResumeFile || resumeCooldown > 0}>
                    {resumeCooldown > 0 ? `Wait ${resumeCooldown}s` : "Update"}
                  </Button>
                </Box>
              </form>
            </div>


            <form onSubmit={handleUpdateName}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  label="Name"
                  required
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </Box>
            </form>

            <form onSubmit={handleUpdateDescription}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                <TextField
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </Box>
            </form>

            <form onSubmit={handleUpdatePhone}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                <TextField
                  label="Phone Number"
                  required
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={{ flexGrow: 1 }}
                  slotProps={{
                    htmlInput: {
                      pattern: "\\d{10}",
                      title: "Please enter a valid 10-digit phone number (numbers only)"
                    }
                  }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </Box>
            </form>

            <form onSubmit={handleUpdateAddress}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2, outline: "1px solid #c0c0c0", borderRadius: "4px", padding: "16px" }}>
                <TextField
                  label="Address Line 1"
                  required
                  variant="outlined"
                  value={address.address1 || ''}
                  onChange={(e) => setAddress(prev => ({ ...prev, address1: e.target.value }))}
                />
                <TextField
                  label="Address Line 2"
                  variant="outlined"
                  value={address.address2 || ''}
                  onChange={(e) => setAddress(prev => ({ ...prev, address2: e.target.value }))}
                />
                <TextField
                  label="City"
                  required
                  variant="outlined"
                  value={address.city || ''}
                  onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                />
                <Select
                  native
                  required
                  label="State"
                  value={address.state || ''}
                  onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                >
                  <option value="">Select State</option>
                  {["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map((stateAbbr) => (
                    <option key={stateAbbr} value={stateAbbr}>
                      {stateAbbr}
                    </option>
                  ))}
                </Select>
                <TextField
                  label="Zip Code"
                  required
                  variant="outlined"
                  value={address.zip || ''}
                  onChange={(e) => setAddress(prev => ({ ...prev, zip: e.target.value }))}
                  slotProps={{
                    htmlInput: {
                      pattern: "\\d{5}(-\\d{4})?",
                      title: "Please enter a valid zip code (e.g., 12345 or 12345-6789)"
                    }
                  }}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: "flex-center" }}>
                  Update
                </Button>
              </Box>
            </form>

          </TabPanel>

          <TabPanel value="2" sx={{}}>

            <form onSubmit={handlePasswordChange}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                <TextField
                  label="Current Password"
                  variant="outlined"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <TextField
                  label="New Password"
                  variant="outlined"
                  type="password"
                  required

                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    htmlInput: {
                      title: "Password must be at least 6 characters long",
                      pattern: ".{6,}"
                    }
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={confirmPassword !== "" && confirmPassword !== password}
                  helperText={
                    confirmPassword !== "" && confirmPassword !== password
                      ? "Passwords do not match"
                      : ""
                  }
                />
                <Button type="submit" variant="contained" color="primary">
                  Change Password
                </Button>
              </Box>
            </form>
          </TabPanel>

        </Box>
      </TabContext>
    </div>
  )
}

export default JobSeekerSettings
