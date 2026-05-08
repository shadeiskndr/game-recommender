"use client";

import Image from "next/image";
import React, { useState } from "react";

const ImageWithFallback = (props: {
  src: string;
  alt: string;
  className: string;
  imageClassName?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
}) => {
  const [imgSrc, setImgSrc] = useState(props.src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${props.className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900 animate-pulse rounded-lg"></div>
      )}
      <Image
        fill
        src={imgSrc}
        alt={props.alt}
        sizes={props.sizes ?? "(max-width: 768px) 100vw, 50vw"}
        loading={props.loading}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc("/placeholder.jpeg");
          setIsLoading(false);
        }}
        className={`${props.imageClassName ?? ""} transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};

export default ImageWithFallback;
