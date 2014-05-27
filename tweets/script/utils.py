from conf import TV_SHOWS


def get_all_references():
    return [y for x in TV_SHOWS.values() for y in x]


def get_tv_show_from_reference(references):
    for reference in references:
        for name, refs in TV_SHOWS.iteritems():
            for ref in refs:
                if ref[1:].lower() == reference.lower():
                    return name
