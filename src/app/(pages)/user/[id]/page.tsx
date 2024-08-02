"use client";

import Image from "next/image";
import { Button } from "flowbite-react";
import { ChangeEvent, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { getUserData, updateUserData } from "./service";
import { useForm } from "react-hook-form";
import { GoInfo } from "react-icons/go";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import toast from "react-hot-toast";
import { uploadImage } from "@/utils/helper-functions";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ConfirmationBox from "@/components/confirmation-box/confirmation-box";
import { confirmAlert } from "react-confirm-alert";

function User({ params }: { params: { id: string } }) {
  const { id } = params;
  const fileInput = useRef<HTMLInputElement>();
  const [image, setImage] = useState<File>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["currentUser", { id }],
    queryFn: () => getUserData(id),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: any }) =>
      updateUserData(userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });

      toast.success("Data akun anda berhasil diperbarui");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  console.log(data);
  console.log(imagePreviewUrl);
  if (!data) return null;

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string); // Set the preview URL to the loaded file
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      let body: {
        username?: string;
        phone?: string;
        password?: string;
        profileImage?: string;
      } = {};
      let profileImage = "";

      if (data.username) body.username = data.username;
      if (data.phone) body.phone = data.phone;
      if (data.password) body.password = data.password;

      if (image) {
        profileImage = await uploadImage(image);

        if (profileImage && profileImage !== "")
          body.profileImage = profileImage;
      }

      await mutateAsync({ userId: id, body });
    } catch (error) {
      toast.error("Perubahan gagalÏ");
    }
  };

  console.log(errors);

  return (
    <div className="p-4 col-span-7 w-full pl-5">
      <h1 className="font-semibold text-2xl mb-5">Pengaturan Pengguna</h1>

      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit((data) => {
          confirmAlert({
            customUI: ({ onClose }: { onClose: () => void }) => {
              return (
                <ConfirmationBox
                  icon={<GoInfo />}
                  judul="Konfirmasi Perubahan"
                  pesan="Apakah anda yakin untuk mengubah data profil anda?"
                  onClose={onClose}
                  onClickIya={() => onSubmit(data)}
                  labelIya="Yakin"
                  labelTidak="Sebentar, saya cek lagi"
                />
              );
            },
          });
        })}
      >
        <div className="flex items-center gap-3">
          <div className="w-[80px] aspect-square rounded-full relative overflow-hidden group">
            {isLoading || isPending ? (
              <Skeleton height="100%" />
            ) : (
              <Image
                alt="User Profile Image"
                src={
                  imagePreviewUrl === ""
                    ? `${data.user.profileImage}`
                    : imagePreviewUrl
                }
                fill
                className="object-cover"
              />
            )}

            <div
              className="absolute -bottom-0 bg-primary/50 flex items-center justify-center text-[8px] text-center text-white w-full h-8 transition-all translate-y-10 group-hover:-translate-y-0 cursor-pointer"
              onClick={() => {
                if (fileInput.current) fileInput.current.click();
              }}
            >
              <p>
                Change <br />
                image
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-grow-1 w-[10%]">
            {isLoading || isPending ? (
              <Skeleton count={2} />
            ) : (
              <>
                <h3 className="text-slate-600">@{`${data.user.username}`}</h3>
                <h4>{`${data.user.email}`}</h4>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-grow-1 w-[80%]">
          <label htmlFor="username">Nama</label>

          {isLoading || isPending ? (
            <Skeleton height="2rem" />
          ) : (
            <>
              <input
                type="text"
                className="w-full rounded-lg border-none"
                {...register("username")}
                placeholder={data.user.username}
              />
              {errors?.name && (
                <p className="text-red-500">{`${errors?.name.message}`}</p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-grow-1 w-[80%]">
          <label htmlFor="phone">Nomor Telepon</label>

          {isLoading || isPending ? (
            <Skeleton height="2rem" />
          ) : (
            <>
              <input
                type="number"
                className="w-full rounded-lg border-none"
                {...register("phone")}
                placeholder={data.user.phone || "Anda belum mengisi nomor telepon, silahkan isi data nomor telepon anda disini"}
              />
              {errors?.phone && (
                <p className="text-red-500">{`${errors?.phone.message}`}</p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-grow-1 w-[80%]">
          <label htmlFor="password">Kata Sandi</label>
          {isLoading || isPending ? (
            <Skeleton height="2rem" />
          ) : (
            <>
              <div className="relative">
                <input
                  type={showPassword1 ? "text" : "password"}
                  className="w-full rounded-lg border-none"
                  placeholder="Tidak perlu mengisi, jika tidak ingin mengubah..."
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center text-sm  justify-end"
                  onClick={() => setShowPassword1(!showPassword1)}
                >
                  {showPassword1 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword &&
                errors.confirmPassword.message ===
                  "Kata sandi yang anda masukkan tidak cocok" && (
                  <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
                )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-grow-1 w-[80%]">
          <label htmlFor="confirmPassword">Ulangi Kata Sandi</label>
          {isLoading || isPending ? (
            <Skeleton height="2rem" />
          ) : (
            <>
              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  className="w-full rounded-lg border-none"
                  placeholder="Tidak perlu mengisi, jika tidak ingin mengubah..."
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center text-sm  justify-end"
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
              )}
            </>
          )}
        </div>

        <input
          type="file"
          className="hidden"
          onChange={onChangeFile}
          ref={(el) => {
            if (el) fileInput.current = el;
          }}
        />

        <Button
          type="submit"
          className="mt-3 w-[80%]"
          pill
          disabled={isLoading || isPending}
        >
          Update
        </Button>
      </form>
    </div>
  );
}

export default User;
