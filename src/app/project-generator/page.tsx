import PromptBuilder from '@/components/prompt-builder'
import NavBar from '@/components/NavBar'
import { Prompt } from 'next/font/google'
import React from 'react'

function page() {
  return (
    <div>
      <PromptBuilder/>
    </div>
  )
}

export default page