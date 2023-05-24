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

type PageState = {
  setState: Dispatch<SetStateAction<State>>;
  userText: string;
  setUserText: Dispatch<SetStateAction<string>>;
  pageEntries: string[];
  setPageEntries: Dispatch<SetStateAction<string[]>>;
  loadingState: string;
  setLoadingState: Dispatch<SetStateAction<string>>;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
};

type HomeWrapperProps = {
  currKey: number;
  setKey: Dispatch<SetStateAction<number>>;
};

function getMainComponent(state: State, pageState: PageState) {
  switch (state) {
    case State.WELCOME: {
      return <Welcome {...pageState} />;
    }
    case State.ENTRY: {
      return <Entry {...pageState} />;
    }
    case State.LOADING: {
      return <Loading {...pageState} />;
    }
    case State.DISPLAY: {
      return <Display {...pageState} />;
    }
  }
}

function Welcome({ setState }: PageState) {
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
  setPageEntries,
  setLoadingState,
  setCount,
}: PageState) {
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
                (c: number) => setCount(c),
                userText,
                (newPageEntries, error) => {
                  if (error) {
                    setPageEntries([
                      "An error was encountered during summarization.",
                    ]);
                  } else {
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

function Loading({ loadingState, count }: PageState) {
  // TODO (pdakin): Showing a streamed token count would be nice for the loading page.
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
        <Typography variant="h5" component={"span"}>
          {loadingState}
        </Typography>
        <CircularProgress color="secondary" sx={{ margin: 2.0 }} size={100} />
        <Typography variant="h5" component={"span"}>
          Received {count} characters from OpenAI
        </Typography>
      </Paper>
    </Fade>
  );
}

function Display({ pageEntries }: PageState) {
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
  const [pageEntries, setPageEntries] = useState(Array<string>());
  const [loadingState, setLoadingState] = useState("");
  const [count, setCount] = useState(0);

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
      {getMainComponent(state, {
        setState,
        userText,
        setUserText,
        pageEntries,
        setPageEntries,
        loadingState,
        setLoadingState,
        count,
        setCount,
      })}
    </Paper>
  );
}

export default function Home() {
  // Key used to clear state when image is clicked to revert home.
  const [key, setKey] = useState(0);
  return <HomeWrapper key={key} currKey={key} setKey={setKey} />;
}
