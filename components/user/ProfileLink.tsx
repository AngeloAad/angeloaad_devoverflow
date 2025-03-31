import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ProfileLinkProps {
  imgUrl: string
  alt: string
  title: string
  href?: string
  imgStyles?: string
  textStyles?: string
}
const ProfileLink = ({
  imgUrl,
  alt,
  title,
  href,
  imgStyles,
  textStyles,
}: ProfileLinkProps) => {
  return (
    <div className="flex items-center gap-1.5">
      {href ? (
        <Link href={href} className="flex items-center gap-1.5">
          <Image src={imgUrl} alt={alt} width={20} height={20} className={cn(imgStyles)} />
          <p className={cn(textStyles)}>{title}</p>
        </Link>
      ) : (
        <>
          <Image src={imgUrl} alt={alt} width={20} height={20} className={cn(imgStyles)} />
          <p className={cn(textStyles)}>{title}</p>
        </>
      )}
    </div>
  )
}

export default ProfileLink