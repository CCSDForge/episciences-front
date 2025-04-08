import { useState, useEffect } from 'react';
import { AvailableLanguage } from '../../../../utils/i18n';
import { AbstractType } from '../../../../types/article';
import './DisplayAbstract.scss';
import { MathJax } from 'better-react-mathjax';

// Type definition for a formatted abstract
interface AbstractResult {
    lang: string;
    text: string;
}

// Props for the component
interface DisplayAbstractProps {
    abstract: AbstractType;
    language: AvailableLanguage;
    showLanguageLabels?: boolean;
}


const DisplayAbstract = ({
                             abstract,
                             language,
                             showLanguageLabels = true
                         }: DisplayAbstractProps) => {
    const [sortedAbstracts, setSortedAbstracts] = useState<AbstractResult[]>([]);

    // Function to extract abstracts from specific formats
    const getAbstracts = (abstract: AbstractType): AbstractResult[] => {
        const results: AbstractResult[] = [];

        if (Array.isArray(abstract.value)) {
            // CASE 1.1 abstract.value is an array of string
            if (abstract.value.length > 0 && typeof abstract.value[0] === 'string') {
                const defaultLang = import.meta.env.VITE_JOURNAL_DEFAULT_LANGUAGE || 'fr';
                    results.push({
                        lang: defaultLang,
                        text: abstract.value[0]
                });
            } else {
                // CASE 1.2: abstract.value is an array of objects (multiple languages)
                abstract.value.forEach(item => {
                    if (typeof item === 'object' && item !== null && '@xml:lang' in item && 'value' in item  && typeof item['@xml:lang'] === 'string' && typeof item.value === 'string') {
                        results.push({
                            lang: item['@xml:lang'],
                            text: item.value
                        });
                    }
                });
            }
        }
        // CASE 2: abstract.value is an object with a single language
        else if (typeof abstract.value === 'object' && abstract.value !== null) {
            if ('@xml:lang' in abstract.value && 'value' in abstract.value && typeof abstract.value['@xml:lang'] === 'string' && typeof abstract.value.value === 'string') {
                results.push({
                    lang: abstract.value['@xml:lang'],
                    text: abstract.value.value,
                });
            }
        }
        // CASE 3: abstract.value is a string
        else {
            const defaultLang = import.meta.env.VITE_JOURNAL_DEFAULT_LANGUAGE || 'fr';
            results.push({
                lang: defaultLang,
                text: abstract.value
            });
        }
        return results;
    };

    // Function to sort abstracts by language preference
    const sortAbstractsByLanguage = (
        abstracts: AbstractResult[],
        currentLang: AvailableLanguage
    ): AbstractResult[] => {
        // Get default language from environment variables
        const defaultLanguage = import.meta.env.VITE_JOURNAL_DEFAULT_LANGUAGE || "fr";

        return [...abstracts].sort((a, b) => {
            // Current language always comes first
            if (a.lang === currentLang && b.lang !== currentLang) return -1;
            if (a.lang !== currentLang && b.lang === currentLang) return 1;

            // Second priority: English if default language is French, French if default language is English
            let secondPriorityLang = defaultLanguage === 'fr' ? 'en' : 'fr';

            // If current language and second priority language are the same, adjust second priority
            if (currentLang === secondPriorityLang) {
                secondPriorityLang = defaultLanguage;
            }

            if (a.lang === secondPriorityLang && b.lang !== secondPriorityLang) return -1;
            if (a.lang !== secondPriorityLang && b.lang === secondPriorityLang) return 1;

            // For other languages, sort alphabetically
            return a.lang.localeCompare(b.lang);
        });
    };

    useEffect(() => {
        if (abstract) {
            const abstracts = getAbstracts(abstract);
            const sorted = sortAbstractsByLanguage(abstracts, language);
            setSortedAbstracts(sorted);
        }
    }, [abstract, language]);

    return (
        <div className="abstract-display">
            {sortedAbstracts.length > 0 && (
                <div className="abstract-container">
                    {sortedAbstracts.map((item, index) => (
                        <div key={index} className="abstract-item">
                            <div className="abstract-content">
                                {showLanguageLabels && (
                                    <span className="abstract-language-label">
                                    {(item.lang || 'unknown').toUpperCase()}&nbsp;
                                </span>
                                )}
                                <MathJax dynamic>
                                    <span className="abstract-text">{item.text}</span>
                                </MathJax>
                            </div>
                            {index !== sortedAbstracts.length - 1 && <hr className="separator" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DisplayAbstract;