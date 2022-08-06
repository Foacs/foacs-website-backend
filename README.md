<h1 align=center>
    Foacs website backend
</h1>
<p align="center">
    Backend for Foacs website.
</p>
<p align=center>
    <img alt="ForTheBadge" src="https://forthebadge.com/images/badges/built-with-love.svg" >
    <img alt="ForTheBadge" src="https://forthebadge.com/images/badges/made-with-javascript.svg" >
</p>
# Error codes

## 1XXX - Common codes

Codes between `1 000` and ` 1 999` are common to any endpoints

### 10XX - User request

Codes between `1 000` and `1 099` are related to user request

| code | meaning                           |
| ---- | --------------------------------- |
| 1001 | Unknown ID                        |
| 1002 | Wrong body                        |
| 1003 | Invalid page argument (negative)  |
| 1004 | Invalid limit argument (negative) |

### 11XX - DB issues

Codes between `1 100` and `1 199` are related to issue while executing DB operation

| code | meaning                                  |
| ---- | ---------------------------------------- |
| 1101 | Issue while _retrieving_ document        |
| 1102 | Issue while _creating_ document          |
| 1103 | Issue while _updating_ document          |
| 1104 | Issue while _deleting_ document          |
| 1105 | Non unique result while once is expected |

### 12XX - Authentication issue

Codes between `1 200` and `1 299` are related to issue with authentication

| code | meaning                    |
| ---- | -------------------------- |
| 1201 | No authentication provided |
| 1202 | Access not autorized       |

## License

This project is licensed under the terms of the **CeCILL** license.

> You can check out the full license [here](./LICENSE.md).
