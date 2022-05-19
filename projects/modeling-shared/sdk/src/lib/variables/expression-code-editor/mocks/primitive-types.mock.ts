/*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable max-len */

import { ModelingTypeMap, ModelingTypeSuggestion } from '../services/modeling-type.model';

/* cspell: disable */
export const expectedPrimitiveTypes: ModelingTypeMap = {
    'boolean': {
        'id': 'boolean'
    },
    'integer': {
        'id': 'integer'
    },
    'string': {
        'id': 'string',
        'properties': [],
        'methods': [
            {
                'type': 'string',
                'signature': 'charAt',
                'documentation': 'Returns the char value at the specified index.',
                'parameters': [
                    {
                        'label': 'index',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'codePointAt',
                'documentation': 'Returns the character (Unicode code point) at the specified index.',
                'parameters': [
                    {
                        'label': 'index',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'codePointBefore',
                'documentation': 'Returns the character (Unicode code point) before the specified index.'
            },
            {
                'type': 'integer',
                'signature': 'codePointCount',
                'documentation': 'Returns the number of Unicode code points in the specified text range of this String.',
                'parameters': [
                    {
                        'label': 'beginIndex',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'endIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'compareTo',
                'documentation': 'Compares two strings lexicographically.',
                'parameters': [
                    {
                        'label': 'anotherString',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'compareToIgnoreCase',
                'documentation': 'Compares two strings lexicographically, ignoring case differences.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'concat',
                'documentation': 'Concatenates the specified string to the end of this string.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'contains',
                'documentation': 'Returns true if and only if this string contains the specified sequence of char values.',
                'parameters': [
                    {
                        'label': 's',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'contentEquals',
                'documentation': 'Compares this string to the specified CharSequence.',
                'parameters': [
                    {
                        'label': 's',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'endsWith',
                'documentation': 'Tests if this string ends with the specified suffix.',
                'parameters': [
                    {
                        'label': 'suffix',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'equalsIgnoreCase',
                'documentation': 'Compares this String to another String, ignoring case considerations.',
                'parameters': [
                    {
                        'label': 'anotherString',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'array',
                'signature': 'getBytes',
                'documentation': 'Encodes this String into a sequence of bytes using the platform\'s default charset, storing the result into a new byte array.'
            },
            {
                'type': 'array',
                'signature': 'getBytes',
                'documentation': 'Encodes this String into a sequence of bytes using the named charset, storing the result into a new byte array.',
                'parameters': [
                    {
                        'label': 'charsetName',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'null',
                'signature': 'getChars',
                'documentation': 'Copies characters from this string into the destination character array.',
                'parameters': [
                    {
                        'label': 'srcBegin',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'srcEnd',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'dst',
                        'documentation': 'string'
                    },
                    {
                        'label': 'dstBegin',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'hashCode',
                'documentation': 'Returns a hash code for this string.'
            },
            {
                'type': 'integer',
                'signature': 'indexOf',
                'documentation': 'Returns the index within this string of the first occurrence of the specified character.',
                'parameters': [
                    {
                        'label': 'ch',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'indexOf',
                'documentation': 'Returns the index within this string of the first occurrence of the specified character, starting the search at the specified index.',
                'parameters': [
                    {
                        'label': 'ch',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'fromIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'indexOf',
                'documentation': 'Returns the index within this string of the first occurrence of the specified substring.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'indexOf',
                'documentation': 'Returns the index within this string of the first occurrence of the specified substring, starting at the specified index.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    },
                    {
                        'label': 'fromIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'intern',
                'documentation': 'Returns a canonical representation for the string object.'
            },
            {
                'type': 'boolean',
                'signature': 'isBlank',
                'documentation': 'Returns true if the string is empty or contains only white space codepoints, otherwise false.'
            },
            {
                'type': 'boolean',
                'signature': 'isEmpty',
                'documentation': 'Returns true if, and only if, length() is 0.'
            },
            {
                'type': 'integer',
                'signature': 'lastIndexOf',
                'documentation': 'Returns the index within this string of the last occurrence of the specified character.',
                'parameters': [
                    {
                        'label': 'ch',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'lastIndexOf',
                'documentation': 'Returns the index within this string of the last occurrence of the specified character, searching backward starting at the specified index.',
                'parameters': [
                    {
                        'label': 'ch',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'fromIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'lastIndexOf',
                'documentation': 'Returns the index within this string of the last occurrence of the specified substring.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'lastIndexOf',
                'documentation': 'Returns the index within this string of the last occurrence of the specified substring, searching backward starting at the specified index.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    },
                    {
                        'label': 'fromIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'length',
                'documentation': 'Returns the length of this string.'
            },
            {
                'type': 'boolean',
                'signature': 'matches',
                'documentation': 'Tells whether or not this string matches the given regular expression.',
                'parameters': [
                    {
                        'label': 'regex',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'offsetByCodePoints',
                'documentation': 'Returns the index within this String that is offset from the given index by codePointOffset code points.',
                'parameters': [
                    {
                        'label': 'index',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'codePointOffset',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'regionMatches',
                'documentation': 'Tests if two string regions are equal.',
                'parameters': [
                    {
                        'label': 'ignoreCase',
                        'documentation': 'boolean'
                    },
                    {
                        'label': 'toffset',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'other',
                        'documentation': 'string'
                    },
                    {
                        'label': 'ooffset',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'len',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'regionMatches',
                'documentation': 'Tests if two string regions are equal.',
                'parameters': [
                    {
                        'label': 'toffset',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'other',
                        'documentation': 'string'
                    },
                    {
                        'label': 'ooffset',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'len',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'repeat',
                'documentation': 'Returns a string whose value is the concatenation of this string repeated count times.',
                'parameters': [
                    {
                        'label': 'count',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'replace',
                'documentation': 'Returns a string resulting from replacing all occurrences of oldChar in this string with newChar.',
                'parameters': [
                    {
                        'label': 'oldChar',
                        'documentation': 'string'
                    },
                    {
                        'label': 'newChar',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'replaceAll',
                'documentation': 'Replaces each substring of this string that matches the given regular expression with the given replacement.',
                'parameters': [
                    {
                        'label': 'regex',
                        'documentation': 'string'
                    },
                    {
                        'label': 'replacement',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'replaceFirst',
                'documentation': 'Replaces the first substring of this string that matches the given regular expression with the given replacement.',
                'parameters': [
                    {
                        'label': 'regex',
                        'documentation': 'string'
                    },
                    {
                        'label': 'replacement',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'string-array',
                'signature': 'split',
                'documentation': 'Splits this string around matches of the given regular expression.',
                'parameters': [
                    {
                        'label': 'regex',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'string-array',
                'signature': 'split',
                'documentation': 'Splits this string around matches of the given regular expression.',
                'parameters': [
                    {
                        'label': 'regex',
                        'documentation': 'string'
                    },
                    {
                        'label': 'limit',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'startsWith',
                'documentation': 'Tests if this string starts with the specified prefix.',
                'parameters': [
                    {
                        'label': 'prefix',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'startsWith',
                'documentation': 'Tests if the substring of this string beginning at the specified index starts with the specified prefix.',
                'parameters': [
                    {
                        'label': 'prefix',
                        'documentation': 'string'
                    },
                    {
                        'label': 'offset',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'strip',
                'documentation': 'Returns a string whose value is this string, with all leading and trailing white space removed.'
            },
            {
                'type': 'string',
                'signature': 'stripLeading',
                'documentation': 'Returns a string whose value is this string, with all leading white space removed.'
            },
            {
                'type': 'string',
                'signature': 'stripTrailing',
                'documentation': 'Returns a string whose value is this string, with all trailing white space removed.'
            },
            {
                'type': 'string',
                'signature': 'substring',
                'documentation': 'Returns a string that is a substring of this string.',
                'parameters': [
                    {
                        'label': 'beginIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'substring',
                'documentation': 'Returns a string that is a substring of this string.',
                'parameters': [
                    {
                        'label': 'beginIndex',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'endIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'array',
                'signature': 'toCharArray',
                'documentation': 'Converts this string to a new character array.'
            },
            {
                'type': 'string',
                'signature': 'toLowerCase',
                'documentation': 'Converts all of the characters in this String to lower case using the rules of the default locale.'
            },
            {
                'type': 'string',
                'signature': 'toUpperCase',
                'documentation': 'Converts all of the characters in this String to upper case using the rules of the default locale.'
            },
            {
                'type': 'string',
                'signature': 'trim',
                'documentation': 'Returns a string whose value is this string, with all leading and trailing space removed, where space is defined as any character whose codepoint is less than or equal to \'U+ 0020\' (the space character).'
            },
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ]
    },
    'json': {
        'id': 'json',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': []
    },
    'date': {
        'id': 'date',
        'properties': [],
        'methods': [
            {
                'signature': 'after',
                'type': 'boolean',
                'documentation': 'Tests if this date is after the specified date.',
                'parameters': [
                    {
                        'label': 'date',
                        'documentation': 'date: date - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'before',
                'type': 'boolean',
                'documentation': 'Tests if this date is before the specified date.',
                'parameters': [
                    {
                        'label': 'date',
                        'documentation': 'date: date - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'compareTo',
                'type': 'integer',
                'documentation': 'Compares two Dates for ordering.',
                'parameters': [
                    {
                        'label': 'anotherDate',
                        'documentation': 'anotherDate: date - the date to be compared'
                    }
                ]
            },
            {
                'signature': 'getTime',
                'type': 'integer',
                'documentation': 'Returns the number of milliseconds since January 1, 1970, 00:00:00 GMT represented by this Date object.'
            },
            {
                'signature': 'setTime',
                'type': 'null',
                'documentation': 'Sets this Date object to represent a point in time that is time milliseconds after January 1, 1970 00:00:00 GMT.',
                'parameters': [
                    {
                        'label': 'time',
                        'documentation': 'time: integer - the number of milliseconds'
                    }
                ]
            },
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ]
    },
    'datetime': {
        'id': 'datetime',
        'properties': [],
        'methods': [
            {
                'signature': 'after',
                'type': 'boolean',
                'documentation': 'Tests if this date is after the specified date.',
                'parameters': [
                    {
                        'label': 'date',
                        'documentation': 'date: date - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'before',
                'type': 'boolean',
                'documentation': 'Tests if this date is before the specified date.',
                'parameters': [
                    {
                        'label': 'date',
                        'documentation': 'date: date - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'compareTo',
                'type': 'integer',
                'documentation': 'Compares two Dates for ordering.',
                'parameters': [
                    {
                        'label': 'anotherDate',
                        'documentation': 'anotherDate: date - the date to be compared'
                    }
                ]
            },
            {
                'signature': 'getTime',
                'type': 'integer',
                'documentation': 'Returns the number of milliseconds since January 1, 1970, 00:00:00 GMT represented by this Date object.'
            },
            {
                'signature': 'setTime',
                'type': 'null',
                'documentation': 'Sets this Date object to represent a point in time that is time milliseconds after January 1, 1970 00:00:00 GMT.',
                'parameters': [
                    {
                        'label': 'time',
                        'documentation': 'time: integer - the number of milliseconds'
                    }
                ]
            },
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ]
    },
    'content-info': {
        'id': 'content-info',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'sizeInBytes',
                'documentation': 'Node size in bytes',
                'type': 'integer'
            },
            {
                'property': 'mimeType',
                'documentation': 'Node mime type',
                'type': 'string'
            }
        ]
    },
    'content': {
        'id': 'content',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'id',
                'documentation': 'Node identifier',
                'type': 'string'
            },
            {
                'property': 'name',
                'documentation': 'Node name',
                'type': 'string'
            },
            {
                'property': 'uri',
                'documentation': 'Node URI',
                'type': 'string'
            },
            {
                'property': 'content',
                'type': 'content-info'
            }
        ]
    },
    'content-array': {
        'id': 'content-array',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'length',
                'type': 'integer',
                'documentation': 'Return the number of elements in the array'
            }
        ],
        'collectionOf': 'content'
    },
    'file': {
        'id': 'file',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'id',
                'documentation': 'Node identifier',
                'type': 'string'
            },
            {
                'property': 'name',
                'documentation': 'Node name',
                'type': 'string'
            },
            {
                'property': 'uri',
                'documentation': 'Node URI',
                'type': 'string'
            },
            {
                'property': 'content',
                'type': 'content-info'
            },
            {
                'property': 'length',
                'type': 'integer',
                'documentation': 'Return the number of elements in the array'
            }
        ],
        'collectionOf': 'content'
    },
    'node': {
        'id': 'node',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'id',
                'documentation': 'Node identifier',
                'type': 'string'
            },
            {
                'property': 'name',
                'documentation': 'Node name',
                'type': 'string'
            }
        ]
    },
    'node-array': {
        'id': 'node-array',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'length',
                'type': 'integer',
                'documentation': 'Return the number of elements in the array'
            }
        ],
        'collectionOf': 'node'
    },
    'folder': {
        'id': 'folder',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'id',
                'documentation': 'Node identifier',
                'type': 'string'
            },
            {
                'property': 'name',
                'documentation': 'Node name',
                'type': 'string'
            },
            {
                'property': 'length',
                'type': 'integer',
                'documentation': 'Return the number of elements in the array'
            }
        ],
        'collectionOf': 'node'
    },
    'null': {
        'id': 'null'
    },
    'string-array': {
        'id': 'string-array',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'length',
                'type': 'integer',
                'documentation': 'Return the number of elements in the array'
            }
        ],
        'collectionOf': 'string'
    },
    'array': {
        id: 'array',
        methods: [
            {
                signature: 'add',
                type: 'boolean',
                documentation: 'Appends the specified element to the end of this list (optional operation).',
                parameters: [
                    {
                        label: 'element',
                        documentation: 'element - element to be appended to this list',
                    },
                ],
            },
            {
                signature: 'add',
                type: 'null',
                documentation: 'Inserts the specified element at the specified position in this list (optional operation).',
                parameters: [
                    {
                        label: 'index',
                        documentation: 'index - index at which the specified element is to be inserted',
                    },
                    {
                        label: 'element',
                        documentation: 'element - element to be inserted',
                    },
                ],
            },
            {
                signature: 'addAll',
                type: 'boolean',
                documentation: 'Appends all of the elements in the specified collection to the end of this list, in the order that they are returned by the specified collection\'s iterator (optional operation).',
                parameters: [
                    {
                        label: 'c',
                        documentation: 'c - collection containing elements to be added to this list',
                    },
                ],
            },
            {
                signature: 'addAll',
                type: 'boolean',
                documentation: 'Inserts all of the elements in the specified collection into this list at the specified position (optional operation).',
                parameters: [
                    {
                        label: 'index',
                        documentation: 'index - index at which to insert the first element from the specified collection',
                    },
                    {
                        label: 'c',
                        documentation: 'c - collection containing elements to be added to this list',
                    },
                ],
            },
            {
                signature: 'clear',
                type: 'null',
                documentation: 'Removes all of the elements from this list (optional operation).',
            },
            {
                signature: 'contains',
                type: 'boolean',
                documentation: 'Returns true if this list contains the specified element.',
                parameters: [
                    {
                        label: 'o',
                        documentation: 'o - element whose presence in this list is to be tested',
                    },
                ],
            },
            {
                signature: 'containsAll',
                type: 'boolean',
                documentation: 'Returns true if this list contains all of the elements of the specified collection.',
                parameters: [
                    {
                        label: 'c',
                        documentation: 'c - collection to be checked for containment in this list',
                    },
                ],
            },
            {
                signature: 'get',
                type: 'json',
                documentation: 'Returns the element at the specified position in this list.',
                parameters: [
                    {
                        label: 'index',
                        documentation: 'index - index of the element to return',
                    },
                ],
                isArrayAccessor: true,
            },
            {
                signature: 'indexOf',
                type: 'integer',
                documentation: 'Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.',
                parameters: [
                    {
                        label: 'o',
                        documentation: 'o - element to search for',
                    },
                ],
            },
            {
                signature: 'isEmpty',
                type: 'boolean',
                documentation: 'Returns true if this list contains no elements.',
            },
            {
                signature: 'lastIndexOf',
                type: 'integer',
                documentation: 'Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element.',
                parameters: [
                    {
                        label: 'o',
                        documentation: 'o - element to search for',
                    },
                ],
            },
            {
                signature: 'remove',
                type: 'json',
                documentation: 'Removes the element at the specified position in this list (optional operation).',
                parameters: [
                    {
                        label: 'index',
                        documentation: 'index - the index of the element to be removed',
                    },
                ],
                isArrayAccessor: true,
            },
            {
                signature: 'remove',
                type: 'boolean',
                documentation: 'Removes the first occurrence of the specified element from this list, if it is present (optional operation).',
                parameters: [
                    {
                        label: 'o',
                        documentation: 'o - element to be removed from this list, if present',
                    },
                ],
            },
            {
                signature: 'removeAll',
                type: 'boolean',
                documentation: 'Removes from this list all of its elements that are contained in the specified collection (optional operation).',
                parameters: [
                    {
                        label: 'c',
                        documentation: 'c - collection containing elements to be removed from this list',
                    },
                ],
            },
            {
                signature: 'retainAll',
                type: 'boolean',
                documentation: 'Retains only the elements in this list that are contained in the specified collection (optional operation).',
                parameters: [
                    {
                        label: 'c',
                        documentation: 'c - collection containing elements to be retained in this list',
                    },
                ],
            },
            {
                signature: 'set',
                type: 'json',
                documentation: 'Replaces the element at the specified position in this list with the specified element (optional operation).',
                parameters: [
                    {
                        label: 'index',
                        documentation: 'index - index of the element to replace',
                    },
                    {
                        label: 'element',
                        documentation: 'element - element to be stored at the specified position',
                    },
                ],
                isArrayAccessor: true,
            },
            {
                signature: 'size',
                type: 'integer',
                documentation: 'Returns the number of elements in this list.',
            },
            {
                signature: 'subList',
                type: 'array',
                documentation: 'Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.',
                parameters: [
                    {
                        label: 'fromIndex',
                        documentation: 'fromIndex - low endpoint (inclusive) of the subList',
                    },
                    {
                        label: 'toIndex',
                        documentation: 'toIndex - high endpoint (exclusive) of the subList',
                    },
                ],
                isSameTypeAsObject: true,
            },
            {
                signature: 'toArray',
                type: 'array',
                documentation: 'Returns an array containing all of the elements in this list in proper sequence (from first to last element).',
            },
            {
                signature: 'equals',
                type: 'boolean',
                documentation: 'Indicates whether some other object is "equal to" this one.',
                parameters: [
                    {
                        label: 'obj',
                        documentation: 'obj: object - the reference object with which to compare',
                    },
                ],
            },
            {
                signature: 'hashCode',
                type: 'integer',
                documentation: 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.',
            },
            {
                signature: 'toString',
                type: 'string',
                documentation: 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.',
            },
        ],
        properties: [
        ],
        collectionOf: 'json',
    }
};

export const expectedArrayMethodSuggestions: ModelingTypeSuggestion[] = [
    {
        label: 'add(element): boolean',
        filterText: 'add',
        kind: 0,
        insertText: 'add(${1:element})',
        documentation: 'Appends the specified element to the end of this list (optional operation).',
        detail: 'boolean',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'add(index, element): null',
        filterText: 'add',
        kind: 0,
        insertText: 'add(${1:index}, ${2:element})',
        documentation: 'Inserts the specified element at the specified position in this list (optional operation).',
        detail: 'null',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'addAll(c): boolean',
        filterText: 'addAll',
        kind: 0,
        insertText: 'addAll(${1:c})',
        documentation: 'Appends all of the elements in the specified collection to the end of this list, in the order that they are returned by the specified collection\'s iterator (optional operation).',
        detail: 'boolean',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'addAll(index, c): boolean',
        filterText: 'addAll',
        kind: 0,
        insertText: 'addAll(${1:index}, ${2:c})',
        documentation: 'Inserts all of the elements in the specified collection into this list at the specified position (optional operation).',
        detail: 'boolean',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'clear(): null',
        filterText: 'clear',
        kind: 0,
        insertText: 'clear()',
        documentation: 'Removes all of the elements from this list (optional operation).',
        detail: 'null',
        insertTextRules: undefined,
        command: undefined,
    },
    {
        label: 'contains(o): boolean',
        filterText: 'contains',
        kind: 0,
        insertText: 'contains(${1:o})',
        documentation: 'Returns true if this list contains the specified element.',
        detail: 'boolean',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'containsAll(c): boolean',
        filterText: 'containsAll',
        kind: 0,
        insertText: 'containsAll(${1:c})',
        documentation: 'Returns true if this list contains all of the elements of the specified collection.',
        detail: 'boolean',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'get(index): json',
        filterText: 'get',
        kind: 0,
        insertText: 'get(${1:index})',
        documentation: 'Returns the element at the specified position in this list.',
        detail: 'json',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'indexOf(o): integer',
        filterText: 'indexOf',
        kind: 0,
        insertText: 'indexOf(${1:o})',
        documentation: 'Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.',
        detail: 'integer',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'isEmpty(): boolean',
        filterText: 'isEmpty',
        kind: 0,
        insertText: 'isEmpty()',
        documentation: 'Returns true if this list contains no elements.',
        detail: 'boolean',
        insertTextRules: undefined,
        command: undefined,
    },
    {
        label: 'lastIndexOf(o): integer',
        filterText: 'lastIndexOf',
        kind: 0,
        insertText: 'lastIndexOf(${1:o})',
        documentation: 'Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element.',
        detail: 'integer',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'remove(index): json',
        filterText: 'remove',
        kind: 0,
        insertText: 'remove(${1:index})',
        documentation: 'Removes the element at the specified position in this list (optional operation).',
        detail: 'json',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'remove(o): boolean',
        filterText: 'remove',
        kind: 0,
        insertText: 'remove(${1:o})',
        documentation: 'Removes the first occurrence of the specified element from this list, if it is present (optional operation).',
        detail: 'boolean',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'removeAll(c): boolean',
        filterText: 'removeAll',
        kind: 0,
        insertText: 'removeAll(${1:c})',
        documentation: 'Removes from this list all of its elements that are contained in the specified collection (optional operation).',
        detail: 'boolean',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'retainAll(c): boolean',
        filterText: 'retainAll',
        kind: 0,
        insertText: 'retainAll(${1:c})',
        documentation: 'Retains only the elements in this list that are contained in the specified collection (optional operation).',
        detail: 'boolean',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'set(index, element): json',
        filterText: 'set',
        kind: 0,
        insertText: 'set(${1:index}, ${2:element})',
        documentation: 'Replaces the element at the specified position in this list with the specified element (optional operation).',
        detail: 'json',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'size(): integer',
        filterText: 'size',
        kind: 0,
        insertText: 'size()',
        documentation: 'Returns the number of elements in this list.',
        detail: 'integer',
        insertTextRules: undefined,
        command: undefined,
    },
    {
        label: 'subList(fromIndex, toIndex): array',
        filterText: 'subList',
        kind: 0,
        insertText: 'subList(${1:fromIndex}, ${2:toIndex})',
        documentation: 'Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.',
        detail: 'array',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'toArray(): array',
        filterText: 'toArray',
        kind: 0,
        insertText: 'toArray()',
        documentation: 'Returns an array containing all of the elements in this list in proper sequence (from first to last element).',
        detail: 'array',
        insertTextRules: undefined,
        command: undefined,
    },
    {
        label: 'equals(obj): boolean',
        filterText: 'equals',
        kind: 0,
        insertText: 'equals(${1:obj})',
        documentation: 'Indicates whether some other object is "equal to" this one.',
        detail: 'boolean',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints',
        },
    },
    {
        label: 'hashCode(): integer',
        filterText: 'hashCode',
        kind: 0,
        insertText: 'hashCode()',
        documentation: 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.',
        detail: 'integer',
        insertTextRules: undefined,
        command: undefined,
    },
    {
        label: 'toString(): string',
        filterText: 'toString',
        kind: 0,
        insertText: 'toString()',
        documentation: 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.',
        detail: 'string',
        insertTextRules: undefined,
        command: undefined,
    },
];

export const expectedArrayPropertiesSuggestions: ModelingTypeSuggestion[] = [];

export const expectedArraySignatureHelpers = [
    {
        label: 'add(element): boolean',
        documentation: 'Appends the specified element to the end of this list (optional operation).',
        parameters: [
            {
                label: 'element',
                documentation: 'element - element to be appended to this list',
            },
        ],
        method: {
            signature: 'add',
            type: 'boolean',
            documentation: 'Appends the specified element to the end of this list (optional operation).',
            parameters: [
                {
                    label: 'element',
                    documentation: 'element - element to be appended to this list',
                },
            ],
        },
    },
    {
        label: 'add(index, element): null',
        documentation: 'Inserts the specified element at the specified position in this list (optional operation).',
        parameters: [
            {
                label: 'index',
                documentation: 'index - index at which the specified element is to be inserted',
            },
            {
                label: 'element',
                documentation: 'element - element to be inserted',
            },
        ],
        method: {
            signature: 'add',
            type: 'null',
            documentation: 'Inserts the specified element at the specified position in this list (optional operation).',
            parameters: [
                {
                    label: 'index',
                    documentation: 'index - index at which the specified element is to be inserted',
                },
                {
                    label: 'element',
                    documentation: 'element - element to be inserted',
                },
            ],
        },
    },
    {
        label: 'addAll(c): boolean',
        documentation: 'Appends all of the elements in the specified collection to the end of this list, in the order that they are returned by the specified collection\'s iterator (optional operation).',
        parameters: [
            {
                label: 'c',
                documentation: 'c - collection containing elements to be added to this list',
            },
        ],
        method: {
            signature: 'addAll',
            type: 'boolean',
            documentation: 'Appends all of the elements in the specified collection to the end of this list, in the order that they are returned by the specified collection\'s iterator (optional operation).',
            parameters: [
                {
                    label: 'c',
                    documentation: 'c - collection containing elements to be added to this list',
                },
            ],
        },
    },
    {
        label: 'addAll(index, c): boolean',
        documentation: 'Inserts all of the elements in the specified collection into this list at the specified position (optional operation).',
        parameters: [
            {
                label: 'index',
                documentation: 'index - index at which to insert the first element from the specified collection',
            },
            {
                label: 'c',
                documentation: 'c - collection containing elements to be added to this list',
            },
        ],
        method: {
            signature: 'addAll',
            type: 'boolean',
            documentation: 'Inserts all of the elements in the specified collection into this list at the specified position (optional operation).',
            parameters: [
                {
                    label: 'index',
                    documentation: 'index - index at which to insert the first element from the specified collection',
                },
                {
                    label: 'c',
                    documentation: 'c - collection containing elements to be added to this list',
                },
            ],
        },
    },
    {
        label: 'clear(): null',
        documentation: 'Removes all of the elements from this list (optional operation).',
        parameters: undefined,
        method: {
            signature: 'clear',
            type: 'null',
            documentation: 'Removes all of the elements from this list (optional operation).',
        },
    },
    {
        label: 'contains(o): boolean',
        documentation: 'Returns true if this list contains the specified element.',
        parameters: [
            {
                label: 'o',
                documentation: 'o - element whose presence in this list is to be tested',
            },
        ],
        method: {
            signature: 'contains',
            type: 'boolean',
            documentation: 'Returns true if this list contains the specified element.',
            parameters: [
                {
                    label: 'o',
                    documentation: 'o - element whose presence in this list is to be tested',
                },
            ],
        },
    },
    {
        label: 'containsAll(c): boolean',
        documentation: 'Returns true if this list contains all of the elements of the specified collection.',
        parameters: [
            {
                label: 'c',
                documentation: 'c - collection to be checked for containment in this list',
            },
        ],
        method: {
            signature: 'containsAll',
            type: 'boolean',
            documentation: 'Returns true if this list contains all of the elements of the specified collection.',
            parameters: [
                {
                    label: 'c',
                    documentation: 'c - collection to be checked for containment in this list',
                },
            ],
        },
    },
    {
        label: 'get(index): json',
        documentation: 'Returns the element at the specified position in this list.',
        parameters: [
            {
                label: 'index',
                documentation: 'index - index of the element to return',
            },
        ],
        method: {
            signature: 'get',
            type: 'json',
            documentation: 'Returns the element at the specified position in this list.',
            parameters: [
                {
                    label: 'index',
                    documentation: 'index - index of the element to return',
                },
            ],
            isArrayAccessor: true,
        },
    },
    {
        label: 'indexOf(o): integer',
        documentation: 'Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.',
        parameters: [
            {
                label: 'o',
                documentation: 'o - element to search for',
            },
        ],
        method: {
            signature: 'indexOf',
            type: 'integer',
            documentation: 'Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.',
            parameters: [
                {
                    label: 'o',
                    documentation: 'o - element to search for',
                },
            ],
        },
    },
    {
        label: 'isEmpty(): boolean',
        documentation: 'Returns true if this list contains no elements.',
        parameters: undefined,
        method: {
            signature: 'isEmpty',
            type: 'boolean',
            documentation: 'Returns true if this list contains no elements.',
        },
    },
    {
        label: 'lastIndexOf(o): integer',
        documentation: 'Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element.',
        parameters: [
            {
                label: 'o',
                documentation: 'o - element to search for',
            },
        ],
        method: {
            signature: 'lastIndexOf',
            type: 'integer',
            documentation: 'Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element.',
            parameters: [
                {
                    label: 'o',
                    documentation: 'o - element to search for',
                },
            ],
        },
    },
    {
        label: 'remove(index): json',
        documentation: 'Removes the element at the specified position in this list (optional operation).',
        parameters: [
            {
                label: 'index',
                documentation: 'index - the index of the element to be removed',
            },
        ],
        method: {
            signature: 'remove',
            type: 'json',
            documentation: 'Removes the element at the specified position in this list (optional operation).',
            parameters: [
                {
                    label: 'index',
                    documentation: 'index - the index of the element to be removed',
                },
            ],
            isArrayAccessor: true,
        },
    },
    {
        label: 'remove(o): boolean',
        documentation: 'Removes the first occurrence of the specified element from this list, if it is present (optional operation).',
        parameters: [
            {
                label: 'o',
                documentation: 'o - element to be removed from this list, if present',
            },
        ],
        method: {
            signature: 'remove',
            type: 'boolean',
            documentation: 'Removes the first occurrence of the specified element from this list, if it is present (optional operation).',
            parameters: [
                {
                    label: 'o',
                    documentation: 'o - element to be removed from this list, if present',
                },
            ],
        },
    },
    {
        label: 'removeAll(c): boolean',
        documentation: 'Removes from this list all of its elements that are contained in the specified collection (optional operation).',
        parameters: [
            {
                label: 'c',
                documentation: 'c - collection containing elements to be removed from this list',
            },
        ],
        method: {
            signature: 'removeAll',
            type: 'boolean',
            documentation: 'Removes from this list all of its elements that are contained in the specified collection (optional operation).',
            parameters: [
                {
                    label: 'c',
                    documentation: 'c - collection containing elements to be removed from this list',
                },
            ],
        },
    },
    {
        label: 'retainAll(c): boolean',
        documentation: 'Retains only the elements in this list that are contained in the specified collection (optional operation).',
        parameters: [
            {
                label: 'c',
                documentation: 'c - collection containing elements to be retained in this list',
            },
        ],
        method: {
            signature: 'retainAll',
            type: 'boolean',
            documentation: 'Retains only the elements in this list that are contained in the specified collection (optional operation).',
            parameters: [
                {
                    label: 'c',
                    documentation: 'c - collection containing elements to be retained in this list',
                },
            ],
        },
    },
    {
        label: 'set(index, element): json',
        documentation: 'Replaces the element at the specified position in this list with the specified element (optional operation).',
        parameters: [
            {
                label: 'index',
                documentation: 'index - index of the element to replace',
            },
            {
                label: 'element',
                documentation: 'element - element to be stored at the specified position',
            },
        ],
        method: {
            signature: 'set',
            type: 'json',
            documentation: 'Replaces the element at the specified position in this list with the specified element (optional operation).',
            parameters: [
                {
                    label: 'index',
                    documentation: 'index - index of the element to replace',
                },
                {
                    label: 'element',
                    documentation: 'element - element to be stored at the specified position',
                },
            ],
            isArrayAccessor: true,
        },
    },
    {
        label: 'size(): integer',
        documentation: 'Returns the number of elements in this list.',
        parameters: undefined,
        method: {
            signature: 'size',
            type: 'integer',
            documentation: 'Returns the number of elements in this list.',
        },
    },
    {
        label: 'subList(fromIndex, toIndex): array',
        documentation: 'Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.',
        parameters: [
            {
                label: 'fromIndex',
                documentation: 'fromIndex - low endpoint (inclusive) of the subList',
            },
            {
                label: 'toIndex',
                documentation: 'toIndex - high endpoint (exclusive) of the subList',
            },
        ],
        method: {
            signature: 'subList',
            type: 'array',
            documentation: 'Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.',
            parameters: [
                {
                    label: 'fromIndex',
                    documentation: 'fromIndex - low endpoint (inclusive) of the subList',
                },
                {
                    label: 'toIndex',
                    documentation: 'toIndex - high endpoint (exclusive) of the subList',
                },
            ],
            isSameTypeAsObject: true,
        },
    },
    {
        label: 'toArray(): array',
        documentation: 'Returns an array containing all of the elements in this list in proper sequence (from first to last element).',
        parameters: undefined,
        method: {
            signature: 'toArray',
            type: 'array',
            documentation: 'Returns an array containing all of the elements in this list in proper sequence (from first to last element).',
        },
    },
    {
        label: 'equals(obj): boolean',
        documentation: 'Indicates whether some other object is "equal to" this one.',
        parameters: [
            {
                label: 'obj',
                documentation: 'obj: object - the reference object with which to compare',
            },
        ],
        method: {
            signature: 'equals',
            type: 'boolean',
            documentation: 'Indicates whether some other object is "equal to" this one.',
            parameters: [
                {
                    label: 'obj',
                    documentation: 'obj: object - the reference object with which to compare',
                },
            ],
        },
    },
    {
        label: 'hashCode(): integer',
        documentation: 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.',
        parameters: undefined,
        method: {
            signature: 'hashCode',
            type: 'integer',
            documentation: 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.',
        },
    },
    {
        label: 'toString(): string',
        documentation: 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.',
        parameters: undefined,
        method: {
            signature: 'toString',
            type: 'string',
            documentation: 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.',
        },
    },
];

export const expectedEventSchemaTypes: ModelingTypeMap = {
    'eventSchema-UserInfo': {
        'id': 'eventSchema-UserInfo',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'displayName',
                'type': 'string'
            },
            {
                'property': 'id',
                'type': 'string'
            }
        ]
    },
    'eventSchema-data-resource-content': {
        'id': 'eventSchema-data-resource-content',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'encoding',
                'type': 'string'
            },
            {
                'property': 'mimeType',
                'type': 'string'
            },
            {
                'property': 'sizeInBytes',
                'type': 'integer'
            }
        ]
    },
    'eventSchema-data-resource-primaryHierarchy': {
        'id': 'eventSchema-data-resource-primaryHierarchy',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'length',
                'type': 'integer',
                'documentation': 'Return the number of elements in the array'
            }
        ],
        'collectionOf': 'string'
    },
    'eventSchema-data-resource-properties': {
        'id': 'eventSchema-data-resource-properties',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': []
    },
    'eventSchema-data-resource-aspectNames': {
        'id': 'eventSchema-data-resource-aspectNames',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'length',
                'type': 'integer',
                'documentation': 'Return the number of elements in the array'
            }
        ],
        'collectionOf': 'string'
    },
    'eventSchema-data-resource': {
        'id': 'eventSchema-data-resource',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'id',
                'type': 'string'
            },
            {
                'property': 'name',
                'type': 'string'
            },
            {
                'property': 'nodeType',
                'type': 'string'
            },
            {
                'property': 'isFile',
                'type': 'boolean'
            },
            {
                'property': 'isFolder',
                'type': 'boolean'
            },
            {
                'property': 'createdByUser',
                'type': 'eventSchema-UserInfo'
            },
            {
                'property': 'createdAt',
                'type': 'string'
            },
            {
                'property': 'modifiedByUser',
                'type': 'eventSchema-UserInfo'
            },
            {
                'property': 'modifiedAt',
                'type': 'string'
            },
            {
                'property': 'content',
                'type': 'eventSchema-data-resource-content'
            },
            {
                'property': 'primaryHierarchy',
                'type': 'eventSchema-data-resource-primaryHierarchy'
            },
            {
                'property': 'properties',
                'type': 'eventSchema-data-resource-properties'
            },
            {
                'property': 'aspectNames',
                'type': 'eventSchema-data-resource-aspectNames'
            }
        ]
    },
    'eventSchema-data': {
        'id': 'eventSchema-data',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'eventGroupId',
                'type': 'string'
            },
            {
                'property': 'resource',
                'type': 'eventSchema-data-resource'
            }
        ]
    },
    'eventSchema': {
        'id': 'eventSchema',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'specversion',
                'type': 'string'
            },
            {
                'property': 'type',
                'type': 'string'
            },
            {
                'property': 'id',
                'type': 'string'
            },
            {
                'property': 'source',
                'type': 'string'
            },
            {
                'property': 'time',
                'type': 'string'
            },
            {
                'property': 'dataschema',
                'type': 'string'
            },
            {
                'property': 'datacontenttype',
                'type': 'string'
            },
            {
                'property': 'data',
                'type': 'eventSchema-data'
            }
        ]
    }
};

export const expectedEventExtendedSchemaTypes: ModelingTypeMap = {
    'eventExtendedSchema': {
        'id': 'eventExtendedSchema',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'specversion',
                'type': 'string'
            },
            {
                'property': 'type',
                'type': 'string'
            },
            {
                'property': 'id',
                'type': 'string'
            },
            {
                'property': 'source',
                'type': 'string'
            },
            {
                'property': 'time',
                'type': 'string'
            },
            {
                'property': 'dataschema',
                'type': 'string'
            },
            {
                'property': 'datacontenttype',
                'type': 'string'
            },
            {
                'property': 'data',
                'type': 'eventSchema-data'
            },
            {
                'property': 'myCustomProperty',
                'type': 'string'
            }
        ]
    }
};

export const expectedRestEventSchemaTypes = {
    'event-rest-data-mapList': {
        'id': 'event-rest-data-mapList',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': []
    },
    'event-rest-data-body': {
        'id': 'event-rest-data-body',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': []
    },
    'event-rest-data': {
        'id': 'event-rest-data',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'method',
                'type': 'string'
            },
            {
                'property': 'path',
                'type': 'string'
            },
            {
                'property': 'params',
                'type': 'event-rest-data-mapList'
            },
            {
                'property': 'headers',
                'type': 'event-rest-data-mapList'
            },
            {
                'property': 'body',
                'type': 'event-rest-data-body'
            }
        ]
    },
    'event-rest': {
        'id': 'event-rest',
        'methods': [
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object - the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': [
            {
                'property': 'specversion',
                'type': 'string'
            },
            {
                'property': 'type',
                'type': 'string'
            },
            {
                'property': 'id',
                'type': 'string'
            },
            {
                'property': 'source',
                'type': 'string'
            },
            {
                'property': 'time',
                'type': 'datetime'
            },
            {
                'property': 'dataschema',
                'type': 'string'
            },
            {
                'property': 'datacontenttype',
                'type': 'string'
            },
            {
                'property': 'data',
                'type': 'event-rest-data'
            }
        ]
    }
};

export const expectedFunctionsSuggestions = [
    {
        label: 'now(): date',
        filterText: 'now',
        kind: 0,
        insertText: 'now()',
        documentation: 'Return the current system date.',
        detail: 'date',
        insertTextRules: undefined,
        command: undefined,
    },
    {
        label: 'list(elements): array',
        filterText: 'list',
        kind: 0,
        insertText: 'list(${1:elements})',
        documentation: 'Returns a list containing an arbitrary number of elements.',
        detail: 'array',
        insertTextRules: 4,
        command: {
            id: 'editor.action.triggerParameterHints'
        },
    }
];
