import { useState } from "react";
import eventData from "./events.json";
import EventGuestPage from "./EventGuestPage";
import EventAdminPage from "./EventAdminPage";
import AdminLoginModal from "./AdminLoginModal";

export default function EventApp() {
  const events = eventData.data;

  const [dataForm, setDataForm] = useState({
    searchTerm: "",
    selectedTag: "",
    selectedStatus: ""
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({
      ...dataForm,
      [name]: value
    });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (
      loginForm.email === "andra@gmail.com" &&
      loginForm.password === "andromeda"
    ) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setLoginError("");
    } else {
      setLoginError("Email atau sandi salah");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setLoginForm({
      email: "",
      password: ""
    });
    setLoginError("");
  };

  const filteredEvents = events.filter((item) => {
    const search = dataForm.searchTerm.toLowerCase();

    const searchableText = [
      item.title,
      item.desc,
      item.tag,
      item.mode,
      item.status,
      item.date,
      item.location?.city,
      item.location?.venue,
      item.location?.platform,
      item.organizer?.name,
      item.organizer?.contact,
      item.speaker?.name,
      item.speaker?.expertise
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchSearch = searchableText.includes(search);

    const matchTag = dataForm.selectedTag
      ? item.tag === dataForm.selectedTag
      : true;

    const matchStatus = dataForm.selectedStatus
      ? item.status === dataForm.selectedStatus
      : true;

    return matchSearch && matchTag && matchStatus;
  });

  const allTags = [...new Set(events.map((item) => item.tag))];
  const allStatuses = [...new Set(events.map((item) => item.status))];

  return (
    <>
      {isAdmin ? (
        <EventAdminPage
          filteredEvents={filteredEvents}
          handleLogout={handleLogout}
          dataForm={dataForm}
          handleChange={handleChange}
          allTags={allTags}
          allStatuses={allStatuses}
        />
      ) : (
        <EventGuestPage
          filteredEvents={filteredEvents}
          dataForm={dataForm}
          handleChange={handleChange}
          allTags={allTags}
          allStatuses={allStatuses}
          setShowLoginModal={setShowLoginModal}
        />
      )}

      <AdminLoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        loginForm={loginForm}
        handleLoginChange={handleLoginChange}
        handleLoginSubmit={handleLoginSubmit}
        loginError={loginError}
        setLoginError={setLoginError}
      />
    </>
  );
}