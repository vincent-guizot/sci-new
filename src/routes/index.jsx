import { createBrowserRouter } from "react-router-dom";

import Layout from "../layouts/Layout";
import Members from "../pages/Members";
import MatchMaking from "../pages/MatchMaking";
import Matches from "../pages/Matches";
import ParticipantsLiked from "../pages/ParticipantsLiked";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Members />,
      },
      {
        path: "/matchmaking",
        element: <MatchMaking />,
      },
      {
        path: "/matches",
        element: <Matches />,
      },
      {
        path: "/participants-liked",
        element: <ParticipantsLiked />,
      },
    ],
  },
]);

export default router;
