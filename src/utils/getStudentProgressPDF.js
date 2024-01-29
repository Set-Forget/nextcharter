import * as pdfMake from "pdfmake/build/pdfmake";

(pdfMake).fonts = {
    Roboto: {
        normal: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
        bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
        italics: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
        bolditalics:
            "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
    },
};

const data = {
    studentName: "Aiden Abbott",
    date: "12/12/2020",
    percentageCompleted: "50%",
    targetPercentage: "100%",
    domains: [
        {
            domain: "English",
            courses: [
                {
                    course: "English 1",
                    competencies: [
                        {
                            competency: "Eng1.4",
                            status: "Not Met",
                        },
                        {
                            competency: "Eng1.1",
                            status: "Not Met",
                        },
                        {
                            competency: "Eng1.3",
                            status: "Not Met",
                        },
                        {
                            competency: "Eng1.4",
                            status: "Plan To Meet",
                        },
                        {
                            competency: "Eng1.1",
                            status: "Plan To Meet",
                        },
                        {
                            competency: "Eng1.3",
                            status: "Plan To Meet",
                        },
                    ],
                },
                {
                    course: "English 2",
                    competencies: [
                        {
                            competency: "Eng2.4",
                            status: "Not Met",
                        },
                        {
                            competency: "Eng2.1",
                            status: "Not Met",
                        },
                        {
                            competency: "Eng2.3",
                            status: "Not Met",
                        },
                        {
                            competency: "Eng2.4",
                            status: "Plan To Meet",
                        },
                        {
                            competency: "Eng2.1",
                            status: "Plan To Meet",
                        },
                        {
                            competency: "Eng2.3",
                            status: "Plan To Meet",
                        },
                        {
                            competency: "Eng2.4",
                            status: "Not Met",
                        },
                        {
                            competency: "Eng2.1",
                            status: "Not Met",
                        },
                        {
                            competency: "Eng2.3",
                            status: "Not Met",
                        },
                        {
                            competency: "Eng2.4",
                            status: "Plan To Meet",
                        },
                        {
                            competency: "Eng2.1",
                            status: "Plan To Meet",
                        },
                        {
                            competency: "Eng2.3",
                            status: "Plan To Meet",
                        },
                    ],
                }
            ]
        },
        {
            domain: "Math",
            courses: [
                {
                    course: "Math 1",
                    competencies: [
                        {
                            competency: "Math1.4",
                            status: "Not Met",
                        },
                        {
                            competency: "Math1.1",
                            status: "Not Met",
                        },
                        {
                            competency: "Math1.3",
                            status: "Not Met",
                        },
                        {
                            competency: "Math1.4",
                            status: "Plan To Meet",
                        },
                        {
                            competency: "Math1.1",
                            status: "Plan To Meet",
                        },
                        {
                            competency: "Math1.3",
                            status: "Plan To Meet",
                        },
                    ],
                },
            ]
        }
    ]
}

export default async function getStudentProgressPDF() {
    var dd = {
        content: [
            {
                table: {
                    widths: '*',
                    body: [
                        [
                            {
                                text: [
                                    { text: "Next Charter School - ", bold: true },
                                    { text: "Student Progress Report", bold: false }
                                ],
                                style: 'header',
                                fillColor: '#13274B',
                                color: '#FFFFFF',
                                margin: [0, 10],
                            }
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            {
                columns: [
                    {
                        width: '*',
                        text: [
                            { text: 'Student: ', bold: false },
                            { text: data.studentName, bold: true },
                        ],
                        bold: true,
                    },
                    {
                        width: '*',
                        alignment: 'right',
                        fontSize: 10,
                        text: [
                            { text: 'Date: ', bold: false },
                            { text: data.date + '\n', bold: true },
                            { text: 'Percentage completed: ', bold: false },
                            { text: data.percentageCompleted + '\n', bold: true },
                            { text: 'Target percentage based on 2027: ', bold: false },
                            { text: data.targetPercentage, bold: true },
                        ],
                    }
                ],
                margin: [0, 20]
            }
        ],
        styles: {
            header: {
                fontSize: 14,
                alignment: 'center'
            },
        }
    };

    data.domains.forEach(domain => {
        dd.content.push({
            table: {
                widths: '*',
                body: [
                    [
                        {
                            text: domain.domain.toUpperCase(),
                            style: 'header',
                            bold: true,
                            margin: [2.5, 2.5],
                            border: [false, false, false, true],
                        }
                    ]
                ],
            },
            margin: [0, 0, 0, 10]
        });

        let coursesColumns = domain.courses.map((course, idx) => {
            let competenciesGroupedByStatus = course.competencies.reduce((group, competency) => {
                group[competency.status] = group[competency.status] || [];
                group[competency.status].push(competency.competency);
                return group;
            }, {});

            return {
                width: '50%',
                table: {
                    widths: '*',
                    body: [
                        [
                            {
                                text: course.course,
                                style: 'header',
                                fontSize: 12,
                                fillColor: '#13274B',
                                color: '#FFFFFF',
                                margin: [0, 1],
                            },
                        ],
                        ...Object.keys(competenciesGroupedByStatus).map(status => {
                            return [
                                {
                                    text: [
                                        { text: `${status}: `, bold: true },
                                        { text: competenciesGroupedByStatus[status].join(', '), bold: false },
                                    ],
                                    fontSize: 10,
                                },
                            ];
                        })
                    ]
                },
                margin: idx % 2 === 0 ? [0, 0, 5, 20] : [5, 0, 0, 20]
            };
        });

        dd.content.push({ columns: coursesColumns });
    });

    pdfMake.createPdf(dd).open();
}



