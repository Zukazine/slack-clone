'use client'

import { Delta, Op } from "quill/core"
import Quill, { QuillOptions } from "quill"
import { PiTextAa } from "react-icons/pi"
import { MdSend } from  "react-icons/md"

import "quill/dist/quill.snow.css"
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Button } from "./ui/button"
import { ImageIcon, Smile } from "lucide-react"
import { Hint } from "./hint"
import { cn } from "@/lib/utils"

type EditorValue = {
  image: File | null
  body: string
}

interface EditorProps {
  onSubmit: ({ image, body}: EditorValue) => void
  onCancel?: () => void
  placeHolder?: string
  defaultValue?: Delta | Op[]
  disabled?: boolean
  innerRef?: MutableRefObject<Quill | null>
  variant?: "create" | "update"
}

const Editor = ({ 
  onCancel,
  onSubmit,
  placeHolder = "Write something...",
  defaultValue = [],
  disabled=false,
  innerRef,
  variant = "create"
}: EditorProps) => {
  const [text, setText] = useState("")
  const [isToolbarisible, setIsToolbarVisible] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const submitRef = useRef(onSubmit)
  const placeHolderRef = useRef(placeHolder)
  const quillRef = useRef<Quill | null>(null)
  const defaultValueRef = useRef(defaultValue)
  const disabledRef = useRef(disabled)

  useLayoutEffect(() => {
    submitRef.current = onSubmit
    placeHolderRef.current = placeHolder
    defaultValueRef.current = defaultValue
    disabledRef.current = disabled
  })

  useEffect(() => {
    if (!containerRef.current) return console.log("KONTOL");

    console.log("Udah ke load blog")
    const container = containerRef.current
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    )

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeHolderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: 'ordered'}, { list: "bullet" }]
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                return
              }
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n")
              }
            }
          }
        }
      }
    }

    const quill = new Quill(editorContainer, options)
    quillRef.current = quill
    quillRef.current.focus()

    if (innerRef) {
      innerRef.current = quill
    }

    quill.setContents(defaultValueRef.current)
    setText(quill.getText())

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)
      if (container) {
        container.innerHTML = ""
      }
      if (quillRef.current) {
        quillRef.current = null
      }
      if (innerRef) {
        innerRef.current = null
      }
    }
  }, [innerRef])

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current)
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar")

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden")
    }
  }

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-editor"/>
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label={isToolbarisible ? "Hide formatting" : "Show formatting"}>
            <Button
              disabled={disabled}
              variant="ghost"
              size="iconSm"
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4"/>
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button
              disabled={disabled}
              variant="ghost"
              size="iconSm"
              onClick={() => {}}
            >
              <Smile className="size-4"/>
            </Button>
          </Hint>
          {variant === "create" && (
            <Hint label="Image">
            <Button
              disabled={disabled}
              variant="ghost"
              size="iconSm"
              onClick={() => {}}
            >
              <ImageIcon className="size-4"/>
            </Button>
          </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {}}
                disabled={disabled || isEmpty}
                className="hover:bg-[#007a5a]/80 text-white bg-[#007a5a]"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button 
            variant="default"
            size="iconSm" 
            className={cn("ml-auto",
              isEmpty ? "text-muted-foreground bg-white" : "hover:bg-[#007a5a]/80 text-white bg-[#007a5a]"
            )}
            disabled={disabled || isEmpty}
            onClick={() => {}}
          >
            <MdSend className="size-4"/>
          </Button>
          )}
        </div>
      </div>
      <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
        <p>
          <strong>Shift + Return</strong> to add a new line
        </p>
      </div>
    </div>
  )
}

export default Editor;