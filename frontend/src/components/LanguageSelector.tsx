import { Select } from '@mantine/core';

interface Language {
  language: string;
  name: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector = ({ languages, selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <div className="w-full">
      <Select
        label="Select Target Language"
        placeholder="Choose language"
        value={selectedLanguage}
        onChange={(value) => onLanguageChange(value || 'en')}
        data={languages.map((lang) => ({
          value: lang.language,
          label: lang.name
        }))}
        searchable
        clearable
        size="lg"
        styles={{
          root: {
            width: '100%'
          },
          input: {
            borderRadius: '1rem',
            border: '2px solid #e2e8f0',
            '&:focus': {
              borderColor: '#3b82f6'
            }
          },
          label: {
            fontSize: '1rem',
            marginBottom: '0.5rem',
            color: '#4b5563'
          },
          dropdown: {
            borderRadius: '1rem',
            border: '2px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          },
          item: {
            '&[data-selected]': {
              backgroundColor: '#3b82f6',
              color: 'white',
              '&:hover': {
                backgroundColor: '#2563eb'
              }
            },
            '&[data-hovered]': {
              backgroundColor: '#eff6ff'
            }
          }
        }}
      />
    </div>
  );
};

export default LanguageSelector; 