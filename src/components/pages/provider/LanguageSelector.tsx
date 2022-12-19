import React, { useState, ChangeEvent } from 'react';
import clsx from 'clsx';
import { difference, union } from 'lodash-es';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StatelessSelector, Pill, InlineTextField } from '@care/react-component-lib';
import { Language } from '@/__generated__/globalTypes';

const mappedLanguages: { [key in Language]: string } = {
  ARABIC: 'Arabic',
  CHINESE: 'Chinese',
  DUTCH: 'Dutch',
  ENGLISH: 'English',
  FINNISH: 'Finnish',
  FRENCH: 'French',
  GERMAN: 'German',
  HEBREW: 'Hebrew',
  PORTUGUESE: 'Portuguese',
  RUSSIAN: 'Russian',
  SIGN_LANGUAGE_ASL: 'Sign Language (ASL)',
  SPANISH: 'Spanish',
  TAGALOG: 'Tagalog',
};

// English and Spanish are always shown
const defaultLanguages: Language[] = [Language.ENGLISH, Language.SPANISH];

const additionalLaguagues = Object.keys(Language).filter(
  (language) => !defaultLanguages.includes(language as Language)
);

const searchAdditionalLanguages = (search: string) =>
  additionalLaguagues.filter((language) => language.toLowerCase().includes(search.toLowerCase()));

interface Props {
  selectedLanguages: Language[];
  onNewLanguageSelected: (languages: Language[]) => void;
}

type selectorType = Language[];

const useStyles = makeStyles((theme) => ({
  addLanguageButton: {
    color: theme.palette.care.blue[700],
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
  },
  selector: {
    '& .MuiListItem-root': {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
      padding: '0px !important',
    },
  },
  allLanguagesSelector: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(-1),
  },
  input: {
    marginTop: theme.spacing(-2),
    width: '100%',
  },
}));

function LanguageSelector({ selectedLanguages, onNewLanguageSelected }: Props) {
  const classes = useStyles();
  const [languageSearchResults, setLanguageSearchResults] = useState<string[]>([]);
  const [addedLanguages, setAddedLanguages] = useState<Language[]>(
    difference(selectedLanguages, defaultLanguages)
  );
  const [addMoreLanguages, setAddMoreLanguages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const languageOptions = union(defaultLanguages, selectedLanguages, addedLanguages);

  // this functions should be updated with real values and actions when hooking up state
  const handleLanguageChange = (languages: selectorType) => {
    onNewLanguageSelected(languages);
  };
  const handleAdditionalLanguageSelected = (value: selectorType) => {
    setAddedLanguages([...addedLanguages, ...value]);
    onNewLanguageSelected(union(selectedLanguages, value));
    setSearchTerm('');
  };
  // typescript not finding types automatically on "e"
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    // replace this with api call
    const langs = searchAdditionalLanguages(value);
    // don't show languages that are already listed
    setLanguageSearchResults(difference(langs, languageOptions));
  };

  return (
    <Grid item container xs={12}>
      <Grid item xs={12}>
        <StatelessSelector
          horizontal
          className={classes.selector}
          onChange={handleLanguageChange}
          value={selectedLanguages}>
          {languageOptions.map((lang) => (
            <Pill key={lang} label={mappedLanguages[lang as Language]} value={lang} />
          ))}
        </StatelessSelector>
      </Grid>

      {addMoreLanguages ? (
        <div className={classes.input}>
          <InlineTextField
            id="addLanguage"
            InputLabelProps={{ shrink: true }}
            name="addLanguage"
            label="Add another language"
            value={searchTerm}
            onChange={onInputChange}
          />
        </div>
      ) : (
        <button
          className={classes.addLanguageButton}
          type="button"
          onClick={() => setAddMoreLanguages(true)}>
          <Typography variant="body2">Add another language</Typography>
        </button>
      )}

      {searchTerm ? (
        <Grid item xs={12}>
          <StatelessSelector
            className={clsx(classes.selector, classes.allLanguagesSelector)}
            horizontal
            onChange={handleAdditionalLanguageSelected}
            single>
            {languageSearchResults.map((lang) => (
              <Pill key={lang} label={mappedLanguages[lang as Language]} value={lang} />
            ))}
          </StatelessSelector>
        </Grid>
      ) : null}
    </Grid>
  );
}

export default LanguageSelector;
