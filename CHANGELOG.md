# Changelog

## [1.4.5](https://github.com/Shanaka11/FTD_Core/compare/v1.4.4...v1.4.5) (2024-01-19)


### Bug Fixes

* **migration:** Fixed issues with migration and model schema definition ([#87](https://github.com/Shanaka11/FTD_Core/issues/87)) ([48a3344](https://github.com/Shanaka11/FTD_Core/commit/48a3344af03f8b3eeeb765f8421ccca8c473ccec))

## [1.4.4](https://github.com/Shanaka11/FTD_Core/compare/v1.4.3...v1.4.4) (2024-01-18)


### Bug Fixes

* **Migration:** Migration fixes ([#85](https://github.com/Shanaka11/FTD_Core/issues/85)) ([abeb331](https://github.com/Shanaka11/FTD_Core/commit/abeb331e5f1c77b06813a9d104db910d2c62e264))

## [1.4.3](https://github.com/Shanaka11/FTD_Core/compare/v1.4.2...v1.4.3) (2024-01-17)


### Bug Fixes

* **Hotfix:** Fixed constraint deployment issues ([#82](https://github.com/Shanaka11/FTD_Core/issues/82)) ([5b27c8c](https://github.com/Shanaka11/FTD_Core/commit/5b27c8c63f2dbdb4e39178c7193a2ccf43d4b61c))

## [1.4.2](https://github.com/Shanaka11/FTD_Core/compare/v1.4.1...v1.4.2) (2024-01-17)


### Bug Fixes

* Db Migration errors ([#78](https://github.com/Shanaka11/FTD_Core/issues/78)) ([d798aee](https://github.com/Shanaka11/FTD_Core/commit/d798aeebb19e7fbe4cbfbebe2ab7fb9342527995))

## [1.4.1](https://github.com/Shanaka11/FTD_Core/compare/v1.4.0...v1.4.1) (2024-01-16)


### Bug Fixes

* **CORE-75, CORE-76, CORE-77, CORE-78, CORE-79, CORE-80:** Issue fixes ([#71](https://github.com/Shanaka11/FTD_Core/issues/71)) ([062de6d](https://github.com/Shanaka11/FTD_Core/commit/062de6db21aaa6a460fa3e69966571f96f181c08))

## [1.4.0](https://github.com/Shanaka11/FTD_Core/compare/v1.3.0...v1.4.0) (2024-01-12)


### Features

* **CORE-74:** Added text data type to handle large text data ([#62](https://github.com/Shanaka11/FTD_Core/issues/62)) ([5d63061](https://github.com/Shanaka11/FTD_Core/commit/5d63061925b697ab6e9e4daf0ba60c808b5cdd6e))

## [1.3.0](https://github.com/Shanaka11/FTD_Core/compare/v1.2.0...v1.3.0) (2024-01-09)


### Features

* **CORE-69, CORE-70:** Added build scripts and instructions ([#61](https://github.com/Shanaka11/FTD_Core/issues/61)) ([1f0bb41](https://github.com/Shanaka11/FTD_Core/commit/1f0bb410191c351b0fd81d2b424e2c1678edd5d5))
* **CORE-73:** Added pagination to read model methods ([#59](https://github.com/Shanaka11/FTD_Core/issues/59)) ([08eca62](https://github.com/Shanaka11/FTD_Core/commit/08eca622f43bb9f0992083ac9f666bb861bf7069))

## [1.2.0](https://github.com/Shanaka11/FTD_Core/compare/v1.1.3...v1.2.0) (2024-01-05)


### Features

* **CORE-37:** Added zod validation and schema generation ([#46](https://github.com/Shanaka11/FTD_Core/issues/46)) ([82f14c1](https://github.com/Shanaka11/FTD_Core/commit/82f14c167d07b7d701de7bc0e47fcb72055324fe))
* **CORE-40:** Filter string generation ([#48](https://github.com/Shanaka11/FTD_Core/issues/48)) ([c5c96c6](https://github.com/Shanaka11/FTD_Core/commit/c5c96c62e66529659bdc9b4c976b0fedbaf7a944))
* **CORE-41:** Migrations added ([#49](https://github.com/Shanaka11/FTD_Core/issues/49)) ([52b2eb3](https://github.com/Shanaka11/FTD_Core/commit/52b2eb38323ba57979b8116790907db745a87241))
* **CORE-43:** Handled SQL injection voulnerablility ([#53](https://github.com/Shanaka11/FTD_Core/issues/53)) ([b509dd6](https://github.com/Shanaka11/FTD_Core/commit/b509dd62658783ec73bbd56e63ea56954bd6a19a))
* **CORE-49, CORE-66:** Added timezone support ([#55](https://github.com/Shanaka11/FTD_Core/issues/55)) ([0357578](https://github.com/Shanaka11/FTD_Core/commit/03575781d6c43d43ef146b68d733974d85eb76b2))
* **CORE-50:** Introduced a folder structure for the generated code ([#57](https://github.com/Shanaka11/FTD_Core/issues/57)) ([4bceb46](https://github.com/Shanaka11/FTD_Core/commit/4bceb4612664586b8b1b214727c31e531f54b98d))
* **CORE-51:** Changed createdAt and updatedAt to numbers ([#52](https://github.com/Shanaka11/FTD_Core/issues/52)) ([1075596](https://github.com/Shanaka11/FTD_Core/commit/1075596abadc0a5b767cce7feb5d5bc58790949f))
* **CORE-57:** Relationship validation ([#50](https://github.com/Shanaka11/FTD_Core/issues/50)) ([31941a3](https://github.com/Shanaka11/FTD_Core/commit/31941a3672a1af02d01ef3a3c70253dda5fa17dc))
* **CORE-58:** Added data types Decimal and float to handle fractions ([#56](https://github.com/Shanaka11/FTD_Core/issues/56)) ([20addce](https://github.com/Shanaka11/FTD_Core/commit/20addceff0ea5804574d3b903c522429910285af))
* **CORE-63:** Order By when reading data ([#54](https://github.com/Shanaka11/FTD_Core/issues/54)) ([cbed81b](https://github.com/Shanaka11/FTD_Core/commit/cbed81b095791e530952b09912ed15087b464929))
* **CORE-64:** Handle update flags on the attribute definitions ([#51](https://github.com/Shanaka11/FTD_Core/issues/51)) ([7eb49b8](https://github.com/Shanaka11/FTD_Core/commit/7eb49b8c9b61c8ffa19d3fbf77ad02cace2dae80))
* **CORE-67:** Updated the readme ([#58](https://github.com/Shanaka11/FTD_Core/issues/58)) ([9013232](https://github.com/Shanaka11/FTD_Core/commit/90132329b034fe8af300e1ae805e8f89ed7ca249))

## [1.1.3](https://github.com/Shanaka11/FTD_Core/compare/v1.1.2...v1.1.3) (2023-10-12)


### Bug Fixes

* **ci:** Changed node version in ci ([#44](https://github.com/Shanaka11/FTD_Core/issues/44)) ([3397d11](https://github.com/Shanaka11/FTD_Core/commit/3397d114db7d1f61fc6314b97f40f2a6c17e3f6f))

## [1.1.2](https://github.com/Shanaka11/FTD_Core/compare/v1.1.1...v1.1.2) (2023-10-12)


### Bug Fixes

* **CI:** Fixed Automatic Release issues ([#42](https://github.com/Shanaka11/FTD_Core/issues/42)) ([9f012f3](https://github.com/Shanaka11/FTD_Core/commit/9f012f381a87df923c89af8b661a98d5a5c28fe2))

## [1.1.1](https://github.com/Shanaka11/FTD_Core/compare/v1.1.0...v1.1.1) (2023-10-12)


### Bug Fixes

* **CI:** Fixed automatic releases ([#40](https://github.com/Shanaka11/FTD_Core/issues/40)) ([d3b7a05](https://github.com/Shanaka11/FTD_Core/commit/d3b7a05be49f2922ed92c1c5af22a4eb7cdbd956))

## [1.1.0](https://github.com/Shanaka11/FTD_Core/compare/v1.0.0...v1.1.0) (2023-10-12)


### Features

* **CORE 15:** created the cli skeleton with commander.js ([#16](https://github.com/Shanaka11/FTD_Core/issues/16)) ([0fd4f5e](https://github.com/Shanaka11/FTD_Core/commit/0fd4f5eaf306eea4b845fa4a4f4399d4291bafe1))
* **CORE 28 / CORE 29:** Generate config file feature ([#18](https://github.com/Shanaka11/FTD_Core/issues/18)) ([b892a4c](https://github.com/Shanaka11/FTD_Core/commit/b892a4c0d3f7da619351ebffdfdcefdb76f87214))
* **CORE-16:** Generate model files and types ([#33](https://github.com/Shanaka11/FTD_Core/issues/33)) ([532ce97](https://github.com/Shanaka11/FTD_Core/commit/532ce97720d403988dfbbf96607f7c3e48c6bb9f))
* **CORE-17, CORE-22:** Base UseCase generation added ([#34](https://github.com/Shanaka11/FTD_Core/issues/34)) ([c0fb077](https://github.com/Shanaka11/FTD_Core/commit/c0fb077150a0fb22a70a2c4ddc7ba0d8f58397e0))
* **CORE-18, CORE-25, CORe-26:** Generate usecase stubs ([#36](https://github.com/Shanaka11/FTD_Core/issues/36)) ([44ab1be](https://github.com/Shanaka11/FTD_Core/commit/44ab1becf8c0547e8e09424d939ced9ae503b6b2))
* **CORE-34:** Added core repository ([#37](https://github.com/Shanaka11/FTD_Core/issues/37)) ([96e5c89](https://github.com/Shanaka11/FTD_Core/commit/96e5c892573170b7fbf9c7f0e545ed183e45ef51))
* **CORE-36:** Added generateId() method ([#38](https://github.com/Shanaka11/FTD_Core/issues/38)) ([e5ecb02](https://github.com/Shanaka11/FTD_Core/commit/e5ecb02124adbf1e0308cfe0ccef7fbee8c80cea))
* **CORE-39:** Added mysql support ([#39](https://github.com/Shanaka11/FTD_Core/issues/39)) ([e308a7d](https://github.com/Shanaka11/FTD_Core/commit/e308a7de95d69da41b52550b0ff13fded9dbd770))
* **CORE19:** Generate Model code tests ([#19](https://github.com/Shanaka11/FTD_Core/issues/19)) ([25cf4b0](https://github.com/Shanaka11/FTD_Core/commit/25cf4b05e8c5a9516fe141e99201d99f98e9a8cd))


### Bug Fixes

* **CORE-33:** Fixed errors in generated model file ([#35](https://github.com/Shanaka11/FTD_Core/issues/35)) ([7323da4](https://github.com/Shanaka11/FTD_Core/commit/7323da42f60ab61756dedbe126e7097e2aeff6f8))

## 1.0.0 (2023-09-11)


### Features

* **CORE-8:** Added manual release feture ([#12](https://github.com/Shanaka11/FTD_Core/issues/12)) ([5e9c716](https://github.com/Shanaka11/FTD_Core/commit/5e9c716b4b6225cfdb69bd454330b0f14fb411e0))


### Bug Fixes

* **CORE 8:** Changed Automatic Publish script ([#11](https://github.com/Shanaka11/FTD_Core/issues/11)) ([cd3e531](https://github.com/Shanaka11/FTD_Core/commit/cd3e5316c0dd1d19f81f833dd286fd50f8f477e4))
* **CORE 8:** Exclude CI check during the merge of Release PR ([#14](https://github.com/Shanaka11/FTD_Core/issues/14)) ([0678715](https://github.com/Shanaka11/FTD_Core/commit/0678715a1affea1ec4e1445f7307e504bbbf10f4))
* **CORE 8:** Fixed autmatic release file ([#15](https://github.com/Shanaka11/FTD_Core/issues/15)) ([f57d4fa](https://github.com/Shanaka11/FTD_Core/commit/f57d4fa8e358a6c2689a8123d29ff2fc4f2a5d3e))
