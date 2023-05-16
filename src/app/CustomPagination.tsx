import { Box, Paper, Button, Typography } from "@mui/material";
import usePagination from "@mui/material/usePagination/usePagination";
import { Dispatch, SetStateAction } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

type CustomPaginationProps = {
  setPage: Dispatch<SetStateAction<number>>;
};

export default function CustomPagination({ setPage }: CustomPaginationProps) {
  const { items } = usePagination({
    count: 3,
    onChange: (_, p) => setPage(p),
  });

  function getLabel(page: number | null) {
    if (!page) {
      console.error("Trying to get page number for null page.");
      return;
    }

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
          // TODO (pdakin): Render something for large page counts.
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
