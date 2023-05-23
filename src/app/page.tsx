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

const MAX_CONTENT_LENGTH_CHARACTERS = 5570;

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
  loadingState: string;
  setLoadingState: Dispatch<SetStateAction<string>>;
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
  setPageEntries: Dispatch<SetStateAction<string[]>>,
  loadingState: string,
  setLoadingState: Dispatch<SetStateAction<string>>
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
          loadingState={loadingState}
          setLoadingState={setLoadingState}
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
          loadingState={loadingState}
          setLoadingState={setLoadingState}
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
          loadingState={loadingState}
          setLoadingState={setLoadingState}
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
          loadingState={loadingState}
          setLoadingState={setLoadingState}
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
          flex: "1",
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
  loadingState,
  setLoadingState,
}: MainComponentProps) {
  const theme = useTheme();
  const textViolation = userText.length > MAX_CONTENT_LENGTH_CHARACTERS;
  return (
    <Fade in={true} timeout={1200}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: "1",
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
              error={textViolation}
              helperText={
                "Please enter less than " +
                MAX_CONTENT_LENGTH_CHARACTERS +
                " characters."
              }
            />
          </Box>
          <Button
            onClick={() => {
              if (textViolation) {
                return;
              }
              summarize(
                (s: string) => setLoadingState(s),
                userText,
                (newInfoListScored, newPageEntries, error) => {
                  if (error) {
                    setPageEntries([
                      "An error was encountered during summarization.",
                    ]);
                  } else {
                    setInfoListScored(newInfoListScored);
                    setPageEntries(newPageEntries);
                  }
                  setState(State.DISPLAY);
                }
              );
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

function Loading({
  setState,
  userText,
  setUserText,
  infoListScored,
  setInfoListScored,
  pageEntries,
  setPageEntries,
  loadingState,
  setLoadingState,
}: MainComponentProps) {
  return (
    <Fade in={true} timeout={1200}>
      <Paper
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          flex: "1",
        }}
      >
        <CircularProgress color="secondary" sx={{ margin: 2.0 }} size={100} />
        <Typography variant="h5" component={"span"}>
          {loadingState}
        </Typography>
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
          flex: "1",
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
  const [loadingState, setLoadingState] = useState("");

  return (
    <Paper
      sx={{
        width: "100vw",
        minHeight: "max(600px, 100vh)",
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
        setPageEntries,
        loadingState,
        setLoadingState
      )}
    </Paper>
  );
}

export default function Home() {
  // Key used to clear state when image is clicked to revert home.
  const [key, setKey] = useState(0);
  return <HomeWrapper key={key} currKey={key} setKey={setKey} />;
}
