"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";

export default function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingMessage, setIsCheckingMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  return <div>page</div>;
}
