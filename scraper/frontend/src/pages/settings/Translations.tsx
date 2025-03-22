import { Inputs } from "@/components/inputs";
import { useQueryApiKeys } from "@/services/apiKey.service";
import { useQueryLanguges } from "@/services/language.service";

function Translations() {
  const {
    data: languagesData,
    isLoading: isLanguagesLoading,
    error,
  } = useQueryLanguges();

  const { data: apiKeyData } = useQueryApiKeys();

  if (error && error.code?.includes("ERR_NETWORK")) {
    throw error;
  }

  const defaultLanguage = languagesData?.languages.find(
    (language) => language.default
  )?.id;

  const languageOptions = languagesData?.languages.map((language) => ({
    value: language.id as string,
    label: language.name,
  }));

  const translationKey = apiKeyData?.apikeys.find(
    (apiKey) => apiKey.translation
  );

  return (
    <>
      <div className="g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">Translations</h3>
        </div>
      </div>
      <div className="col-12 col-xl-6">
        <div className="mb-3 text-start card py-10 px-5 mb-5">
          <label className="form-label" htmlFor="api-key">
            Api key
          </label>
          <input
            className="form-control form-icon-input"
            id="api-key"
            type="text"
            placeholder="Api Key"
            value={translationKey?.key}
          />
        </div>
        <div className="mb-3 card py-10 px-5 mb-5">
          <Inputs.Select
            label="Langauge"
            placeholder="Select language"
            isLoading={isLanguagesLoading}
            value={defaultLanguage}
            options={languageOptions}
          />
        </div>
      </div>
    </>
  );
}

export default Translations;
