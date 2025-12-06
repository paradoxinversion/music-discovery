import * as Yup from "yup";

interface FormLinkMap {
  [key: string]: string;
}

/**
 * Creates Yup string validators for links based on provided patterns.
 * @param formLinkMap
 * @returns
 */
const createLinkShapeValidators = (formLinkMap: FormLinkMap) => {
  const linkShapeValidators = Object.keys(formLinkMap).reduce<
    Record<string, Yup.StringSchema>
  >((acc, key) => {
    const linkPattern = formLinkMap[key];
    if (linkPattern) {
      const regex = new RegExp(linkPattern);
      acc[key] = Yup.string()
        .trim()
        .matches(regex, {
          message: `Invalid URL for ${key}`,
          excludeEmptyString: true,
        })
        .url()
        .optional();
    }
    return acc;
  }, {});
  return linkShapeValidators;
};

export default createLinkShapeValidators;
