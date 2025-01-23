"use client"

import { ThemeProviderProps, NextThemesProvider } from 'next-themes';
import React from 'react'

const ThemeProvider = ({children, ...props}: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}> {children} </NextThemesProvider>
  )
}

export default ThemeProvider;