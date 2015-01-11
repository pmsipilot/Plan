module.exports = {
    user: {
        type: 'document',
        schema: {
            attributes: {
                name: String,
                token: String
            }
        },
        user: true
    },

    project: {
        type: 'document',
        schema: {
            attributes: {
                name: String,
                description: String,
                color: String,
                project_owner: String,
                scrum_master: String,
                repository: String,
                type: String,
                extra: {}
            },
            hasMany: {
                dependancies: { type: 'id', target: 'project' }
            }
        }
    },

    project_delivery: {
        type: 'document',
        schema: {
            attributes: {
                version: String,
                status: String,
                start_date: Date,
                end_date: Date,
                target_date: Date,
                features: String
            },
            hasOne: {
                project: { type: 'id', target: 'project' },
                delivery: { type: 'id', target: 'delivery' }
            }
        }
    },

    delivery: {
        type: 'document',
        schema: {
            attributes: {
                version: String,
                locked: Boolean,
                description: String
            }
        }
    },

    histo: {
        type: 'document',
        schema: {
            attributes: {
                resource: String,
                primaryKey: String,
                action: String,
                content: String,
                date: String,
                username: String
            }
        }
    },

    service: {
        type: 'document',
        schema: {
            attributes: {
                name: String,
                enabled: Boolean,
                config: {}
            }
        }
    }
};
