"use client";

import { ChangeEventHandler, FC, useEffect, useState } from "react";
import { CameraFill, XCircleFill } from "react-bootstrap-icons";
import { DropzoneProps, useDropzone } from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";
import style from "./style.module.scss";
import colors from "@/lib/theme/colors.module.scss";
import Image from "next/image";

const Dropzone: FC<{
  multiple?: boolean;
  isDisabled?: boolean;
  onDrop: DropzoneProps["onDrop"];
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = ({ multiple, onChange, onDrop, isDisabled, ...rest }) => {
  const { getRootProps, getInputProps } = useDropzone({
    disabled: isDisabled,
    multiple,
    onDrop,
    ...rest,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps({ onChange })} accept="image/*" />
      <div className={`p-2 d-flex align-items-center justify-content-center border border-2 ${style.dropzone} `}>
        <CameraFill size="3rem" color="#ddd" />
      </div>
    </div>
  );
};

export interface ReactHookFormDropzoneFieldProps {
  name: string;
  multiple?: boolean;
  disabled?: boolean;
  existPhotos?: string[];
  titlePhotoIndex: number;
  onTitlePhotoChange: (index: number) => void;
  onRemoveExistPhoto: (item: string) => void;
}

export function ReactHookFormDropzoneField(props: ReactHookFormDropzoneFieldProps) {
  const { name, multiple, ...rest } = props;
  const [uploadingFiles, setUploadingFiles] = useState<(File & { preview: string })[]>([]);
  const [existPhotos, setExistPhotos] = useState(props.existPhotos || []);
  const { control } = useFormContext();

  useEffect(() => {
    return () => uploadingFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    // eslint-disable-next-line
  }, []);

  const shift = existPhotos.length > 0 ? existPhotos.length + 1 : 0;

  const isTitlePhoto = (existPhotoIndex: number, uploadingFilesIndex?: number) => {
    if (uploadingFilesIndex !== undefined) {
      return shift + uploadingFilesIndex === props.titlePhotoIndex;
    }

    return existPhotoIndex === props.titlePhotoIndex;
  };

  return (
    <Controller
      render={({ field: { onChange } }) => (
        <div>
          <Dropzone
            isDisabled={props.disabled}
            multiple={multiple ?? true}
            onDrop={(acceptedFiles) => {
              const newPreviews = [
                ...uploadingFiles,
                ...acceptedFiles.map((file) =>
                  Object.assign(file, {
                    preview: URL.createObjectURL(file),
                  })
                ),
              ];
              setUploadingFiles(newPreviews);
              onChange(newPreviews);
            }}
            {...rest}
          />
          <aside className={style.thumbsContainer}>
            {existPhotos.map((item, index) => (
              <div
                className={`${style.thumb} ${isTitlePhoto(index) ? style["thumb-title"] : ""}`}
                key={`${item}-${index}`}
                onClick={() => {
                  props.onTitlePhotoChange(index);
                }}
              >
                <XCircleFill
                  size={22}
                  onClick={() => {
                    const newExistFiles = [...existPhotos].filter((_, i) => i !== index);
                    setExistPhotos(newExistFiles);
                    props.onRemoveExistPhoto(item);
                  }}
                  className={style.close}
                  color={colors.dark}
                />

                <div className={style.thumbInner}>
                  <Image alt="" src={item} className={style.img} width={300} height={300} />
                </div>
                {isTitlePhoto(index) ? <span className={style["thumb-title-label"]}>title image</span> : null}
              </div>
            ))}
            {uploadingFiles.map((file, index) => (
              <div
                className={`${style.thumb} ${isTitlePhoto(existPhotos.length - 1, index) ? style["thumb-title"] : ""}`}
                key={file.name}
                onClick={() => {
                  props.onTitlePhotoChange(shift + index);
                }}
              >
                <XCircleFill
                  size={22}
                  onClick={() => {
                    const newFiles = [...uploadingFiles].filter((_, i) => i !== index);
                    setUploadingFiles(newFiles);
                    onChange(newFiles);
                  }}
                  className={style.close}
                  color={colors.dark}
                />

                <div className={style.thumbInner}>
                  {/* eslint-disable-next-line */}
                  <img
                    src={file.preview}
                    alt=""
                    className={style.img}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                  />
                </div>
                {isTitlePhoto(existPhotos.length - 1, index) ? (
                  <span className={style["thumb-title-label"]}>image titre</span>
                ) : null}
              </div>
            ))}
          </aside>
          {/* <DraggableList
            items={previews}
            onDragEnd={(e) => {
            }}
            onItemClick={() => {}}
          /> */}
        </div>
      )}
      name={name}
      control={control}
      defaultValue=""
    />
  );
}
