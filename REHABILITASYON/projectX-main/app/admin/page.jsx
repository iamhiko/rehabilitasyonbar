"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, Trash2, Upload, Clock, MapPin, FileText, Pen, Menu, Tag, Image as ImageIcon, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore"
import { uploadToImgBB } from "@/lib/imgbb"

export default function AdminPage() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <div className="text-center">
        <h2 className="text-2xl font-medium text-white mb-2">Hoş Geldiniz</h2>
        <p className="text-zinc-400">Lütfen sol menüden bir seçim yapın</p>
      </div>
    </div>
  )
}
