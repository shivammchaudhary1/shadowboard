import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/Common/ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import RoomLobby from "../pages/RoomLobby";
import VotingGame from "../pages/VotingGame";
import Results from "../pages/Results";
import NotificationTest from "../pages/NotificationTest";
import JoinRoom from "../pages/JoinRoom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/notification-test" element={<NotificationTest />} />
      <Route
        path="/join-room"
        element={
          <ProtectedRoute>
            <JoinRoom />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/room/:roomId"
        element={
          <ProtectedRoute>
            <RoomLobby />
          </ProtectedRoute>
        }
      />
      <Route
        path="/room/:roomId/vote"
        element={
          <ProtectedRoute>
            <VotingGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/room/:roomId/results/:questionId"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
