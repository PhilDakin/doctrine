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
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import { Dispatch, SetStateAction, useState } from "react";
import usePagination from "@mui/material/usePagination/usePagination";

// TODO (pdakin): Things you did in Figma to make it work on first pass maybe not always the best.
// Is there a way to write this without so many <Paper/> layers?

enum State {
  WELCOME,
  ENTRY,
  LOADING,
  DISPLAY,
}

type MainComponentProps = {
  setState: Dispatch<SetStateAction<State>>;
};

function getMainComponent(
  state: State,
  setState: Dispatch<SetStateAction<State>>
) {
  switch (state) {
    case State.WELCOME: {
      return <Welcome setState={setState} />;
    }
    case State.ENTRY: {
      return <Entry setState={setState} />;
    }
    case State.LOADING: {
      return <Loading setState={setState} />;
    }
    case State.DISPLAY: {
      return <Display setState={setState} />;
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

function Entry({ setState }: MainComponentProps) {
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
            />
          </Box>
          {/* TODO (pdakin): Going to need to do something with the text here... */}
          <Button
            onClick={() => setState(State.LOADING)}
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
  setInterval(() => {
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

type CustomPaginationProps = {
  setPage: Dispatch<SetStateAction<number>>;
};

function CustomPagination({ setPage }: CustomPaginationProps) {
  const theme = useTheme();
  const { items } = usePagination({
    count: 3,
    onChange: (_, p) => setPage(p),
  });

  function getLabel(page: number) {
    if (page === 1) {
      return "Original Text";
    } else {
      return "Summary #" + (page - 1);
    }
  }

  return (
    <Box sx={{ width: "70%", display: "flex", justifyContent: "center" }}>
      {items.map(({ page, type, selected, ...item }, index) => {
        if (type === "start-ellipsis" || type === "end-ellipsis") {
          // TODO (pdakin)
          return null;
        }

        let content =
          type === "page" ? (
            getLabel(page)
          ) : type === "previous" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          );
        let width = type === "page" ? "100%" : "5%";
        let elevation = type === "page" ? 3 : 0;
        return (
          <Paper
            key={index}
            sx={{ marginX: 0.45 }}
            square
            elevation={elevation}
          >
            <Button
              sx={{ whiteSpace: "nowrap", width: width }}
              type="button"
              {...item}
            >
              <Typography
                sx={{ fontWeight: selected ? "bold" : undefined }}
                color="text.primary"
              >
                {content}
              </Typography>
            </Button>
          </Paper>
        );
      })}
    </Box>
  );
}

function Display({ setState }: MainComponentProps) {
  const [page, setPage] = useState(1);
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
          <CustomPagination setPage={setPage} />
          <Typography sx={{ marginY: 3 }}>
            #{page} - Note that the Pagination page prop starts at 1 to match
            the requirement of including the value in the URL, while the
            TablePagination page prop starts at 0 to match the requirement of
            zero-based JavaScript arrays that comes with rendering a lot of
            tabular data.
          </Typography>
        </Paper>
      </Paper>
    </Fade>
  );
}

export default function Home() {
  const [state, setState] = useState(State.WELCOME);
  return (
    <Paper
      sx={{
        width: "100vw",
        height: "100vh",
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
          <Image src="/doctrine_logo.png" fill={true} alt="" />
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
      {getMainComponent(state, setState)}
    </Paper>
  );
}
