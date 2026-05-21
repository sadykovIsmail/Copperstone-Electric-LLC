import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import ProjectManager from "../components/ProjectManager.jsx";
import SiteContentManager from "../components/SiteContentManager.jsx";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const isCompact = typeof window !== "undefined" && window.innerWidth < 900;
  const allowLocalAdmin = import.meta.env.DEV;

  // Check if a user is logged in when the page loads
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // If not logged in, show the Login Form
  if (!session && !allowLocalAdmin) {
    return (
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", fontFamily: "sans-serif" }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px" }}
          />
          <button type="submit" disabled={loading} style={{ padding: "10px", cursor: "pointer", background: "#C87533", color: "white", border: "none", borderRadius: "6px" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  // If logged in, show the Admin Dashboard
  return (
    <div style={{ padding: isCompact ? "16px" : "40px", fontFamily: "sans-serif", background: "#D8C39B", minHeight: "100vh", overflowX: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isCompact ? "flex-start" : "center", flexDirection: isCompact ? "column" : "row", gap: 16, background: "white", padding: isCompact ? "16px" : "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", marginBottom: "30px" }}>
        <h2 style={{ margin: 0, fontSize: isCompact ? "1.6rem" : "2rem", lineHeight: 1.1 }}>Copperstone Admin Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: "10px 20px", cursor: "pointer", background: "#5F564D", color: "white", border: "none", borderRadius: "6px", alignSelf: isCompact ? "flex-end" : "auto" }}>
          Sign Out
        </button>
      </div>
      
      <div style={{ background: "white", padding: isCompact ? "16px" : "24px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: activeTab === "projects" ? "none" : "1px solid #d9d9d9",
              background: activeTab === "projects" ? "#C87533" : "white",
              color: activeTab === "projects" ? "white" : "#070605",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: activeTab === "content" ? "none" : "1px solid #d9d9d9",
              background: activeTab === "content" ? "#C87533" : "white",
              color: activeTab === "content" ? "white" : "#070605",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Site Copy
          </button>
        </div>

        {activeTab === "projects" ? <ProjectManager /> : <SiteContentManager />}
      </div>
    </div>
  );
}
