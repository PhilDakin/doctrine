"use client";

import {
  Fade,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CustomPagination from "./CustomPagination";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import { Dispatch, SetStateAction, useState } from "react";
import { summarize } from "./models/openai/Llm";

// TODO (pdakin): Things you did in Figma to make it work on first pass maybe not always the best.
// Is there a way to write this without so many <Paper/> layers?
// TODO (pdakin): Is it odd to do a stateful SPA using Next.js like this? Why do I have no routing?

enum State {
  WELCOME,
  ENTRY,
  LOADING,
  DISPLAY,
}

type MainComponentProps = {
  setState: Dispatch<SetStateAction<State>>;
  userText: string;
  setUserText: Dispatch<SetStateAction<string>>;
  infoListScored: (string | number)[][];
  setInfoListScored: Dispatch<SetStateAction<(string | number)[][]>>;
  pageEntries: string[];
  setPageEntries: Dispatch<SetStateAction<string[]>>;
};

type HomeWrapperProps = {
  currKey: number;
  setKey: Dispatch<SetStateAction<number>>;
};

// TODO (pdakin): Clean up argument blow-up below.
function getMainComponent(
  state: State,
  setState: Dispatch<SetStateAction<State>>,
  userText: string,
  setUserText: Dispatch<SetStateAction<string>>,
  infoListScored: (string | number)[][],
  setInfoListScored: Dispatch<SetStateAction<(string | number)[][]>>,
  pageEntries: string[],
  setPageEntries: Dispatch<SetStateAction<string[]>>
) {
  switch (state) {
    case State.WELCOME: {
      return (
        <Welcome
          setState={setState}
          userText={userText}
          setUserText={setUserText}
          infoListScored={infoListScored}
          setInfoListScored={setInfoListScored}
          pageEntries={pageEntries}
          setPageEntries={setPageEntries}
        />
      );
    }
    case State.ENTRY: {
      return (
        <Entry
          setState={setState}
          userText={userText}
          setUserText={setUserText}
          infoListScored={infoListScored}
          setInfoListScored={setInfoListScored}
          pageEntries={pageEntries}
          setPageEntries={setPageEntries}
        />
      );
    }
    case State.LOADING: {
      return (
        <Loading
          setState={setState}
          userText={userText}
          setUserText={setUserText}
          infoListScored={infoListScored}
          setInfoListScored={setInfoListScored}
          pageEntries={pageEntries}
          setPageEntries={setPageEntries}
        />
      );
    }
    case State.DISPLAY: {
      return (
        <Display
          setState={setState}
          userText={userText}
          setUserText={setUserText}
          infoListScored={infoListScored}
          setInfoListScored={setInfoListScored}
          pageEntries={pageEntries}
          setPageEntries={setPageEntries}
        />
      );
    }
  }
}

function Welcome({ setState }: MainComponentProps) {
  const theme = useTheme();
  return (
    <Fade in={true} timeout={1200}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper sx={{ height: "55%", width: "40%" }} elevation={0}>
          <Typography variant="h1" color="secondary" component={"span"}>
            Learn faster
          </Typography>
          <Typography variant="h1" component={"span"}>
            {" "}
            with better summaries.
          </Typography>
          <Typography sx={{ marginY: 1 }} color="text.hint" variant="h6">
            Doctrine provides comprehensive summaries of the information you
            need to know, allowing you to focus more on what matters.
          </Typography>
          <Button
            onClick={() => setState(State.ENTRY)}
            sx={{ marginY: 1 }}
            style={{ backgroundColor: theme.palette.secondary.main }}
            color="primary"
          >
            TRY IT OUT
          </Button>
        </Paper>
      </Paper>
    </Fade>
  );
}

function Entry({
  setState,
  userText,
  setUserText,
  infoListScored,
  setInfoListScored,
  pageEntries,
  setPageEntries,
}: MainComponentProps) {
  const theme = useTheme();
  return (
    <Fade in={true} timeout={1200}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper sx={{ height: "55%", width: "50%" }} elevation={0}>
          <Box>
            <TextField
              multiline
              fullWidth
              minRows={3}
              maxRows={15}
              variant="filled"
              placeholder="Enter your corpus here..."
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
            />
          </Box>
          <Button
            onClick={() => {
              summarize(userText, (newInfoListScored, newPageEntries) => {
                // TODO (pdakin): Timing coordination with loading page when hitting API.
                setInfoListScored(newInfoListScored);
                setPageEntries(newPageEntries);
              });
              setState(State.LOADING);
            }}
            sx={{ marginY: 1 }}
            style={{ backgroundColor: theme.palette.secondary.main }}
            color="primary"
          >
            SUMMARIZE
          </Button>
        </Paper>
      </Paper>
    </Fade>
  );
}

function Loading({ setState }: MainComponentProps) {
  // TODO (pdakin): Use API request success as transition here.
  setTimeout(() => {
    setState(State.DISPLAY);
  }, 1000);
  return (
    <Fade in={true} timeout={1200}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="secondary" size={100} />
      </Paper>
    </Fade>
  );
}

function Display({
  setState,
  userText,
  setUserText,
  infoListScored,
  setInfoListScored,
  pageEntries,
  setPageEntries,
}: MainComponentProps) {
  const [page, setPage] = useState(1);
  const numPages = pageEntries.length;
  return (
    <Fade in={true} timeout={1200}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Paper
          sx={{
            height: "100%",
            width: "50%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
          elevation={0}
        >
          <CustomPagination setPage={setPage} numPages={numPages} />
          <Typography sx={{ marginY: 3 }}>
            {pageEntries[page - 1] /* Page is one-indexed. */}
          </Typography>
        </Paper>
      </Paper>
    </Fade>
  );
}

function HomeWrapper({ currKey, setKey }: HomeWrapperProps) {
  const [state, setState] = useState(State.WELCOME);
  const [userText, setUserText] = useState("");
  const [infoListScored, setInfoListScored] = useState([[]]);
  const [pageEntries, setPageEntries] = useState([]);

  // TODO (pdakin): Is there a more dynamic way to avoid setting minHeight below?
  return (
    <Paper
      sx={{
        width: "100vw",
        height: "100vh",
        minHeight: 600,
        display: "flex",
        flexDirection: "column",
      }}
      square={true}
    >
      <AppBar
        sx={{ height: 120, flexDirection: "row" }}
        position={"relative"}
        elevation={0}
      >
        <Box
          sx={{ height: "75%", width: 32, position: "relative", marginY: 1.9 }}
        >
          <Image
            onClick={() => {
              setState(State.WELCOME);
              setKey(currKey + 1);
            }}
            src="/doctrine_logo.png"
            fill={true}
            alt=""
            sizes="120,32"
          />
        </Box>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography variant="h3">Doctrine</Typography>
        </Box>
      </AppBar>
      {getMainComponent(
        state,
        setState,
        userText,
        setUserText,
        infoListScored,
        setInfoListScored,
        pageEntries,
        setPageEntries
      )}
    </Paper>
  );
}

export default function Home() {
  // Key used to clear state when image is clicked to revert home.
  const [key, setKey] = useState(0);
  return <HomeWrapper key={key} currKey={key} setKey={setKey} />;
}
