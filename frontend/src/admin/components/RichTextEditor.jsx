import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";

import FormatBoldRoundedIcon from "@mui/icons-material/FormatBoldRounded";
import FormatItalicRoundedIcon from "@mui/icons-material/FormatItalicRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function RichTextEditor({ value = "", onChange, disabled = false }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,

    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });
  useEffect(() => {
    if (!editor) {
      return;
    }

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const toolbarButtonSx = {
    minWidth: 40,
    px: 1,
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        overflow: "hidden",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <Stack
        direction="row"
        gap={1}
        sx={{
          p: 1.25,
          backgroundColor: "background.default",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <ButtonGroup size="small" variant="outlined" disabled={disabled}>
          <Tooltip title="Fetstil">
            <Button
              sx={toolbarButtonSx}
              color={editor.isActive("bold") ? "primary" : "inherit"}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <FormatBoldRoundedIcon fontSize="small" />
            </Button>
          </Tooltip>

          <Tooltip title="Kursiv">
            <Button
              sx={toolbarButtonSx}
              color={editor.isActive("italic") ? "primary" : "inherit"}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <FormatItalicRoundedIcon fontSize="small" />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup size="small" variant="outlined" disabled={disabled}>
          <Button
            color={
              editor.isActive("heading", { level: 2 }) ? "primary" : "inherit"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </Button>

          <Button
            color={
              editor.isActive("heading", { level: 3 }) ? "primary" : "inherit"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </Button>
        </ButtonGroup>

        <ButtonGroup size="small" variant="outlined" disabled={disabled}>
          <Tooltip title="Punktlista">
            <Button
              sx={toolbarButtonSx}
              color={editor.isActive("bulletList") ? "primary" : "inherit"}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <FormatListBulletedRoundedIcon fontSize="small" />
            </Button>
          </Tooltip>

          <Tooltip title="Numrerad lista">
            <Button
              sx={toolbarButtonSx}
              color={editor.isActive("orderedList") ? "primary" : "inherit"}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <FormatListNumberedRoundedIcon fontSize="small" />
            </Button>
          </Tooltip>

          <Tooltip title="Citat">
            <Button
              sx={toolbarButtonSx}
              color={editor.isActive("blockquote") ? "primary" : "inherit"}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <FormatQuoteRoundedIcon fontSize="small" />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            mx: 0.5,
          }}
        />

        <ButtonGroup size="small" variant="outlined" disabled={disabled}>
          <Tooltip title="Ångra">
            <span>
              <Button
                sx={toolbarButtonSx}
                disabled={
                  disabled || !editor.can().chain().focus().undo().run()
                }
                onClick={() => editor.chain().focus().undo().run()}
              >
                <UndoRoundedIcon fontSize="small" />
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Gör om">
            <span>
              <Button
                sx={toolbarButtonSx}
                disabled={
                  disabled || !editor.can().chain().focus().redo().run()
                }
                onClick={() => editor.chain().focus().redo().run()}
              >
                <RedoRoundedIcon fontSize="small" />
              </Button>
            </span>
          </Tooltip>
        </ButtonGroup>
      </Stack>

      <Box
        sx={{
          minHeight: 360,
          p: 3,

          "& .tiptap": {
            minHeight: 320,
            outline: "none",
          },

          "& .tiptap h2": {
            mt: 3,
            mb: 1.25,
            fontSize: 26,
            lineHeight: 1.3,
          },

          "& .tiptap h3": {
            mt: 2.5,
            mb: 1,
            fontSize: 21,
            lineHeight: 1.35,
          },

          "& .tiptap p": {
            mb: 1.5,
            lineHeight: 1.8,
          },

          "& .tiptap ul, & .tiptap ol": {
            pl: 3.5,
            mb: 2,
          },

          "& .tiptap li": {
            mb: 0.75,
            lineHeight: 1.7,
          },

          "& .tiptap blockquote": {
            m: 0,
            my: 2,
            pl: 2,
            borderLeft: "4px solid",
            borderColor: "primary.main",
            color: "text.secondary",
          },

          "& .tiptap p.is-editor-empty:first-of-type::before": {
            content: '"Skriv studiematerialet här..."',
            float: "left",
            color: "text.disabled",
            pointerEvents: "none",
            height: 0,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
}

export default RichTextEditor;
