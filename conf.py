TV_SHOWS = {

    'Game Of Thrones': [
        '#gameofthrones',
        '#got',
        '#takethetrone',
        '#BringDowntheKing',
        '#WinterIsComing',
        '@GameOfThrones'
    ],

    'Suits': [
        '#suits',
        '#harveyspecter',
        '#louislitt',
        '#littup',
        '@Suits_USA'
    ],

    'HIMYM': [
        '#HIMYM',
        '#HowIMetYourMother',
        '#HowIMet',
        '@HIMYM_CBS'
    ],
    'Grey\'s Anatomy': [
        '#GreysAnatomy',
        '@ABCGreysAnatomy'
    ],
    'Big Bang Theory': [
        '#BigBangTheory',
        '#TBBT',
        '@BigBang_CBS'
    ]
}


def get_all_references():
    return [y for x in TV_SHOWS.values() for y in x]


def get_tv_show_from_reference(references):
    for reference in references:
        for name, refs in TV_SHOWS.iteritems():
            for ref in refs:
                if ref[1:].lower() == reference.lower():
                    return name