import { Prisma } from "@prisma/client";

import { FormEvent, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { api } from "@/utils/api";

import Link from "next/link";
import Icon from "@/components/Icon";
import { faPenToSquare, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const UserPage = () => {
  const { user } = useUser();

  const { data: links, refetch: refetchLinks } = api.links.getLinks.useQuery(
    {
      userId: user?.id,
    },
    { enabled: !!user, refetchOnWindowFocus: false }
  );

  const [showLinkCreationForm, setShowLinkCreationForm] = useState(false);

  const createLinkMutation = api.links.createLink.useMutation({
    onSuccess: () => {
      refetchLinks();
    },
  });

  const editLinkMutation = api.links.editLink.useMutation({
    onSuccess: () => {
      refetchLinks();
    },
  });

  const deleteLinkMutaion = api.links.deleteLink.useMutation({
    onSuccess: () => {
      refetchLinks();
    },
  });

  const [createdLinkName, setCreatedLinkName] = useState("");
  const [createdLinkHref, setCreatedLinkHref] = useState("");
  const [createdLinkAgeRestricted, setCreatedLinkAgeRestricted] =
    useState(false);

  const resetCreateLinkForm = () => {
    setCreatedLinkName("");
    setCreatedLinkHref("");
    setCreatedLinkAgeRestricted(false);
  };

  const handleCreateLink = (ev: FormEvent) => {
    ev.preventDefault();

    createLinkMutation.mutate({
      name: createdLinkName,
      href: createdLinkHref,
      ageRestricted: createdLinkAgeRestricted,
    });

    setShowLinkCreationForm(false);
    resetCreateLinkForm();
  };

  const handleResetCreateLinkForm = () => {
    setShowLinkCreationForm(false);
    resetCreateLinkForm();
  };

  type Link = Omit<Prisma.LinksGroupByOutputType, "_count" | "_min" | "_max">;

  const [currentlyEditing, setCurrentlyEditing] = useState<Link>();

  const [linkName, setLinkName] = useState<Link["name"] | undefined>();
  const [oldLinkName, setOldLinkName] = useState(linkName);

  const [linkHref, setLinkHref] = useState<Link["href"] | undefined>();
  const [oldLinkHref, setOldLinkHref] = useState(linkHref);

  const [linkAgeRestricted, setLinkAgeRestricted] = useState<
    Link["age_restriced"] | undefined
  >();
  const [oldLinkAgeRestricted, setOldLinkAgeRestricted] =
    useState(linkAgeRestricted);

  const handleEditLink = (link: Link) => {
    setCurrentlyEditing(link);

    setLinkName(link.name);
    setLinkHref(link.href);
    setLinkAgeRestricted(link.age_restriced);

    setOldLinkName(linkName);
    setOldLinkHref(linkHref);
    setOldLinkAgeRestricted(linkAgeRestricted);
  };

  const handleSaveEditLink = (ev: FormEvent) => {
    ev.preventDefault();

    if (linkName && linkHref && linkAgeRestricted && currentlyEditing?.id) {
      editLinkMutation.mutate({
        id: currentlyEditing.id,
        name: linkName,
        href: linkHref,
        ageRestricted: linkAgeRestricted,
      });
    }
    setCurrentlyEditing(undefined);
  };

  const handleCancelEditLink = () => {
    console.log("cancelled edit");
    setCurrentlyEditing(undefined);
    setLinkName(oldLinkName);
    setLinkHref(oldLinkHref);
    setLinkAgeRestricted(oldLinkAgeRestricted);
  };

  useEffect(() => {
    console.log(user?.publicMetadata);
  }, [user]);

  return (
    <main className="container mx-auto flex h-screen flex-col items-center">
      {!user ? (
        <div>loading...</div>
      ) : (
        <>
          <div>{user.username}</div>
          <div>{}</div>
          <button
            onClick={() => {
              setShowLinkCreationForm(true);
            }}
          >
            Add link
          </button>
          <div className="mt-16 flex w-full max-w-md flex-col gap-4">
            {showLinkCreationForm ? (
              <form
                className="flex flex-col gap-4 rounded-lg bg-gray-800 p-4"
                onSubmit={handleCreateLink}
              >
                <label
                  className="flex flex-col"
                  htmlFor="linkNameInput"
                >
                  <span className="mb-2 select-none text-base">Name</span>
                  <input
                    className="rounded-md border-2 border-gray-700 bg-gray-800 px-2 transition hover:border-gray-600 focus:outline-none focus-visible:border-purple-500 hover:focus-visible:border-purple-400"
                    required
                    value={createdLinkName}
                    onChange={(ev) => {
                      setCreatedLinkName(ev.target.value);
                    }}
                    type="text"
                    id="linkNameInput"
                  />
                </label>
                <label
                  className="flex flex-col"
                  htmlFor="linkHrefInput"
                >
                  <span className="mb-2 select-none text-base">Link</span>
                  <input
                    className="rounded-md border-2 border-gray-700 bg-gray-800 px-2 transition hover:border-gray-600 focus:outline-none focus-visible:border-purple-500 hover:focus-visible:border-purple-400"
                    required
                    value={createdLinkHref}
                    onChange={(ev) => {
                      setCreatedLinkHref(ev.target.value);
                    }}
                    type="text"
                    id="linkHrefInput"
                  />
                </label>
                <label
                  className="flex w-fit items-center gap-2"
                  htmlFor="linkAgeRestrictedInput"
                >
                  <span className="select-none text-base">Age restricted</span>
                  <input
                    className="peer sr-only"
                    checked={createdLinkAgeRestricted}
                    onChange={() => {
                      setCreatedLinkAgeRestricted(!createdLinkAgeRestricted);
                    }}
                    type="checkbox"
                    id="linkAgeRestrictedInput"
                  />
                  <span className="grid place-content-center rounded-lg border-2 border-gray-600 p-0.5 peer-checked:bg-gray-600">
                    <Icon
                      className={`transition ${
                        createdLinkAgeRestricted ? "opacity-100" : "opacity-0"
                      }`}
                      iconSize="md"
                      icon={faCheck}
                    />
                  </span>
                </label>
                <div className="ml-auto flex gap-2">
                  <button
                    className="w-fit rounded-lg bg-transparent px-6 py-2 transition hover:bg-white/10"
                    type="button"
                    onClick={() => {
                      handleResetCreateLinkForm();
                      setShowLinkCreationForm(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="w-fit rounded-lg bg-purple-500 px-6 py-2 transition hover:bg-purple-600">
                    Save
                  </button>
                </div>
              </form>
            ) : null}
            {links?.map((link) => {
              if (currentlyEditing?.id === link.id) {
                return (
                  <form
                    className="flex flex-col gap-4 rounded-lg bg-gray-800 p-4"
                    onSubmit={handleSaveEditLink}
                    key={link.id}
                  >
                    <label
                      className="flex flex-col"
                      htmlFor="editLinkNameInput"
                    >
                      <span className="mb-2 select-none text-base">Name</span>
                      <input
                        className="rounded-md border-2 border-gray-700 bg-gray-800 px-2 transition hover:border-gray-600 focus:outline-none focus-visible:border-purple-500 hover:focus-visible:border-purple-400"
                        required
                        value={linkName}
                        onChange={(ev) => {
                          setLinkName(ev.target.value);
                        }}
                        type="text"
                        id="editLinkNameInput"
                      />
                    </label>
                    <label
                      className="flex flex-col"
                      htmlFor="editLinkHrefInput"
                    >
                      <span className="mb-2 select-none text-base">Link</span>
                      <input
                        className="rounded-md border-2 border-gray-700 bg-gray-800 px-2 transition hover:border-gray-600 focus:outline-none focus-visible:border-purple-500 hover:focus-visible:border-purple-400"
                        required
                        value={linkHref}
                        onChange={(ev) => {
                          setLinkHref(ev.target.value);
                        }}
                        type="text"
                        id="editLinkHrefInput"
                      />
                    </label>
                    <label
                      className="flex w-fit items-center gap-2"
                      htmlFor="editLinkAgeRestrictedInput"
                    >
                      <span className="select-none text-base">
                        Age restricted
                      </span>
                      <input
                        className="peer sr-only"
                        checked={linkAgeRestricted}
                        onChange={() => {
                          setLinkAgeRestricted(!linkAgeRestricted);
                        }}
                        type="checkbox"
                        id="editLinkAgeRestrictedInput"
                      />
                      <span className="grid place-content-center rounded-lg border-2 border-gray-600 p-0.5 peer-checked:bg-gray-600">
                        <Icon
                          className={`transition ${
                            linkAgeRestricted ? "opacity-100" : "opacity-0"
                          }`}
                          iconSize="md"
                          icon={faCheck}
                        />
                      </span>
                    </label>
                    <div className="ml-auto flex gap-2">
                      <button
                        className="w-fit rounded-lg bg-transparent px-6 py-2 transition hover:bg-white/10"
                        type="button"
                        onClick={() => {
                          handleCancelEditLink();
                        }}
                      >
                        Cancel
                      </button>
                      <button className="w-fit rounded-lg bg-purple-500 px-6 py-2 transition hover:bg-purple-600">
                        Save
                      </button>
                    </div>
                  </form>
                );
              }
              return (
                <div
                  className="flex items-center justify-between gap-4 rounded-lg bg-gray-800 py-2 pl-4 pr-2"
                  key={link.id}
                >
                  <Link
                    className="grow hover:underline"
                    href={link.href}
                    target="_blank"
                  >
                    {link.name}
                  </Link>
                  <div className="flex h-fit items-center gap-2">
                    <button
                      className="flex rounded-md bg-transparent p-3 transition hover:bg-white/10"
                      onClick={() => {
                        handleEditLink(link);
                      }}
                    >
                      <Icon
                        iconSize="md"
                        icon={faPenToSquare}
                      />
                    </button>
                    <button
                      className="flex rounded-md bg-transparent p-3 transition hover:bg-white/10"
                      onClick={() => {
                        deleteLinkMutaion.mutate({ id: link.id });
                      }}
                    >
                      <Icon
                        iconSize="md"
                        icon={faTrashAlt}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
};

export default UserPage;
