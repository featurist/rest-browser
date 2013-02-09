exports.make absolute url (base, relative) =
    return (URI(relative).absoluteTo(base).normalizePathname().to string())